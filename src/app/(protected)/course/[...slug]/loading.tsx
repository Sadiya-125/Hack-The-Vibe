import { Loader2 } from "lucide-react";
import React from "react";

type Props = {};

const LoadingComponent = (props: Props) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="md:ml-70">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
      </div>
    </div>
  );
};

export default LoadingComponent;
