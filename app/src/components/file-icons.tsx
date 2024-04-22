import { cn } from "@/lib/utils";
import {
  FaCss3,
  FaDatabase,
  FaFilePdf,
  FaFileWord,
  FaHtml5,
  FaJava,
  FaJs,
  FaMarkdown,
  FaPython,
  FaRust,
} from "react-icons/fa6";

export function WordIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <FaFileWord className={cn("text-lg text-blue-500", className)} {...props} />
  );
}

export function RustIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <FaRust className={cn("text-lg text-orange-500", className)} {...props} />
  );
}

export function PdfIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <FaFilePdf className={cn("text-lg text-red-500", className)} {...props} />
  );
}

export function MarkdownIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return <FaMarkdown className={cn("text-lg", className)} {...props} />;
}

export function PythonIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <FaPython className={cn("text-lg text-yellow-500", className)} {...props} />
  );
}

export function JavaScriptIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <FaJs className={cn("text-lg text-yellow-500", className)} {...props} />
  );
}

export function TypeScriptIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    // Fontawesome does not have a TypeScript icon
    <FaJs className={cn("text-lg text-blue-500", className)} {...props} />
  );
}

export function HtmlIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <FaHtml5 className={cn("text-lg text-orange-500", className)} {...props} />
  );
}

export function CssIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <FaCss3 className={cn("text-lg text-blue-500", className)} {...props} />
  );
}

export function JsonIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return <FaJs className={cn("text-lg", className)} {...props} />;
}

export function JavaIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <FaJava className={cn("text-lg text-blue-500", className)} {...props} />
  );
}

export function SqlIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return <FaDatabase className={cn("text-lg", className)} {...props} />;
}

export function IpynbIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <FaPython className={cn("text-lg text-orange-500", className)} {...props} />
  );
}
