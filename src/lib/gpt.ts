import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

function sanitizeJson(raw: string): string {
  return raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim()
    .replace(/:\s*"([^"]*?)"(?=\s*[,}])/g, (match, p1) => {
      const escaped = p1.replace(/"/g, '\\"');
      return `: "${escaped}"`;
    });
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category: string = "",
  output_value_only: boolean = false,
  model: string = "gemini-1.5-flash",
  temperature: number = 1,
  num_tries: number = 3,
  verbose: boolean = false,
) {
  const list_input: boolean = Array.isArray(user_prompt);
  const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
  const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));

  let error_msg: string = "";

  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt: string = `\nYou are to output ${
      list_output && "an array of objects in"
    } the following in json format: ${JSON.stringify(
      output_format,
    )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

    if (list_output) {
      output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
    }

    if (dynamic_elements) {
      output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
    }

    if (list_input) {
      output_format_prompt += `\nGenerate an array of json, one json for each input element.`;
    }

    const final_prompt = system_prompt + output_format_prompt + error_msg;
    const input_prompt = Array.isArray(user_prompt)
      ? user_prompt.join("\n")
      : user_prompt;

    const result = await geminiModel.generateContent(
      final_prompt + "\n" + input_prompt,
    );

    const raw = result.response.text();

    const sanitized = sanitizeJson(raw);

    if (verbose) {
      console.log("System Prompt:", final_prompt);
      console.log("User Prompt:", input_prompt);
      console.log("Gemini Raw Output:", raw);
      console.log("Sanitized Output:", sanitized);
    }

    try {
      let output = JSON.parse(sanitized);

      if (list_input) {
        if (!Array.isArray(output)) {
          throw new Error("Output format not in an array of json");
        }
      } else {
        output = [output];
      }

      for (let index = 0; index < output.length; index++) {
        for (const key in output_format) {
          if (/<.*?>/.test(key)) {
            continue;
          }

          if (!(key in output[index])) {
            throw new Error(`${key} not in json output`);
          }

          if (Array.isArray(output_format[key])) {
            const choices = output_format[key] as string[];
            if (Array.isArray(output[index][key])) {
              output[index][key] = output[index][key][0];
            }
            if (!choices.includes(output[index][key]) && default_category) {
              output[index][key] = default_category;
            }
            if (output[index][key].includes(":")) {
              output[index][key] = output[index][key].split(":")[0];
            }
          }
        }

        if (output_value_only) {
          output[index] = Object.values(output[index]);
          if (output[index].length === 1) {
            output[index] = output[index][0];
          }
        }
      }

      return list_input ? output : output[0];
    } catch (e) {
      error_msg = `\n\nResult: ${raw}\n\nSanitized: ${sanitized}\n\nError message: ${e}`;
      console.log("An exception occurred:", e);
    }
  }

  return [];
}
