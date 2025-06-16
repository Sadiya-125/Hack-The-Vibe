"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import svgPanZoom from "svg-pan-zoom";

interface MeetingCardProps {
  projectId: string;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ projectId }) => {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<string | null>(null);
  const panZoomInstance = useRef<any>(null);
  const [isRendered, setIsRendered] = useState(false);

  const { data: mermaidChart, isLoading } = api.project.getMermaidCode.useQuery(
    { projectId },
  );
  useEffect(() => {
    if (!mermaidChart?.chartCode) return;

    mermaid.initialize({ startOnLoad: false });

    const renderMermaid = async () => {
      try {
        const { svg } = await mermaid.render(
          "githubDiagram",
          mermaidChart.chartCode,
        );

        const styledSvg = svg.replace(/<svg([^>]*?)>/, (_match, attrs) => {
          const cleanedAttrs = attrs
            .replace(/(width|height|style)="[^"]*"/g, "")
            .trim();

          return `<svg ${cleanedAttrs} preserveAspectRatio="xMidYMid meet" width="100%" height="100%" style="max-width:100%; max-height:100%; display:block">`;
        });

        if (!ref.current) return;
        ref.current.innerHTML = styledSvg;

        requestAnimationFrame(() => {
          const svgElement = ref.current?.querySelector<SVGSVGElement>("svg");

          if (svgElement && svgElement.getBBox().width > 0) {
            panZoomInstance.current = svgPanZoom(svgElement, {
              zoomEnabled: true,
              controlIconsEnabled: false,
              fit: true,
              center: true,
              panEnabled: true,
              minZoom: 0.5,
              maxZoom: 10,
            });

            setIsRendered(true);
            svgRef.current = styledSvg;
          } else {
            console.warn("SVG element is not ready or has zero width.");
          }
        });
      } catch (err) {
        console.error("Error Rendering Mermaid Diagram:", err);
        setIsRendered(false);
      }
    };

    renderMermaid();

    return () => {
      if (panZoomInstance.current) {
        panZoomInstance.current.destroy();
        panZoomInstance.current = null;
      }
    };
  }, [mermaidChart]);

  const downloadSVG = () => {
    if (!svgRef.current) return;
    const blob = new Blob([svgRef.current], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Repo-Structure.svg";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (panZoomInstance.current) {
      panZoomInstance.current.resize();
      panZoomInstance.current.fit();
      panZoomInstance.current.center();
      panZoomInstance.current.zoom(1);
    }
  };

  return (
    <Card className="col-span-1 mt-3 p-5">
      <div className="mb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="w-full text-center font-semibold sm:text-left">
            GitHub Repository Structure
          </h2>
          {isRendered && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={handleReset} variant="outline">
                Reset View
              </Button>
              <Button onClick={downloadSVG} variant="outline">
                Download as SVG
              </Button>
            </div>
          )}
        </div>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground text-center text-sm">
          Loading Chart...
        </p>
      ) : mermaidChart ? (
        <div
          ref={ref}
          className="mt-[-20] overflow-auto"
          style={{
            width: "100%",
            height: "300px",
            border: "1px solid #e5e7eb",
            cursor: "grab",
          }}
        />
      ) : (
        <p className="text-center text-sm text-red-500">
          No Mermaid Chart Found
        </p>
      )}
    </Card>
  );
};

export default MeetingCard;
