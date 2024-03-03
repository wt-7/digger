import {
  CssIcon,
  HtmlIcon,
  JavaIcon,
  JavaScriptIcon,
  JsonIcon,
  MarkdownIcon,
  PdfIcon,
  PythonIcon,
  RustIcon,
  SqlIcon,
  TypeScriptIcon,
  WordIcon,
} from "@/components/file-icons";
import { SearchFormValues } from "@/components/form";
import { LanguageName } from "@uiw/codemirror-extensions-langs";

export const DEFAULT_FORM_VALUES: SearchFormValues = {
  path: "",
  needles: [{ pattern: "", required: true }],
  extensions: [],
};

export const EXTENSIONS: {
  label: string;
  value: string;
  language: LanguageName;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}[] = [
  {
    label: ".docx",
    value: "docx",
    language: "textile",
    icon: WordIcon,
  },
  {
    label: ".pdf",
    value: "pdf",
    language: "textile",
    icon: PdfIcon,
  },
  {
    label: ".txt",
    value: "txt",
    language: "textile",
  },
  {
    label: ".md",
    value: "md",
    language: "markdown",
    icon: MarkdownIcon,
  },
  {
    label: ".py",
    value: "py",
    language: "python",
    icon: PythonIcon,
  },
  {
    label: ".rs",
    value: "rs",
    language: "rust",
    icon: RustIcon,
  },
  {
    label: ".js",
    value: "js",
    language: "javascript",
    icon: JavaScriptIcon,
  },
  {
    label: ".ts",
    value: "ts",
    language: "typescript",
    icon: TypeScriptIcon,
  },
  {
    label: ".jsx",
    value: "jsx",
    language: "jsx",
    icon: TypeScriptIcon,
  },
  {
    label: ".tsx",
    value: "tsx",
    language: "tsx",
    icon: TypeScriptIcon,
  },
  {
    label: ".html",
    value: "html",
    language: "html",
    icon: HtmlIcon,
  },
  {
    label: ".css",
    value: "css",
    language: "css",
    icon: CssIcon,
  },
  {
    label: ".json",
    value: "json",
    language: "json",
    icon: JsonIcon,
  },
  {
    label: ".xml",
    value: "xml",
    language: "xml",
  },
  {
    label: ".java",
    value: "java",
    language: "java",
    icon: JavaIcon,
  },
  {
    label: ".php",
    value: "php",
    language: "php",
  },
  {
    label: ".cpp",
    value: "cpp",
    language: "cpp",
  },
  {
    label: ".go",
    value: "go",
    language: "go",
  },
  {
    label: ".rb",
    value: "rb",
    language: "ruby",
  },
  {
    label: ".swift",
    value: "swift",
    language: "swift",
  },
  {
    label: ".kt",
    value: "kt",
    language: "kotlin",
  },
  {
    label: ".cs",
    value: "cs",
    language: "textile",
  },
  {
    label: ".r",
    value: "r",
    language: "textile",
  },
  {
    label: ".lua",
    value: "lua",
    language: "textile",
  },
  {
    label: ".sql",
    value: "sql",
    language: "sql",
    icon: SqlIcon,
  },
  {
    label: ".sh",
    value: "sh",
    language: "textile",
  },
  {
    label: ".ps1",
    value: "ps1",
    language: "textile",
  },
  {
    label: ".bat",
    value: "bat",
    language: "textile",
  },
];
