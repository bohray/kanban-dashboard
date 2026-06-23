import { cn } from "@/lib/utils";

// Shared base styling for all form fields. Width/margins are left to the
// caller — only the look and focus behavior live here.
const fieldClass =
  "rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none transition focus-visible:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-400/30 resize-none";

type InputFieldProps =
  | ({ as?: "input" } & React.ComponentProps<"input">)
  | ({ as: "textarea" } & React.ComponentProps<"textarea">)
  | ({ as: "select" } & React.ComponentProps<"select">);

export default function InputField({
  as = "input",
  className,
  ...props
}: InputFieldProps) {
  const cls = cn(fieldClass, as === "select" && "cursor-pointer", className);

  if (as === "textarea") {
    return (
      <textarea
        className={cls}
        {...(props as React.ComponentProps<"textarea">)}
      />
    );
  }

  if (as === "select") {
    return (
      <select className={cls} {...(props as React.ComponentProps<"select">)} />
    );
  }

  return (
    <input className={cls} {...(props as React.ComponentProps<"input">)} />
  );
}
