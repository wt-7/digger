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
}[] = [
  { label: ".docx", value: "docx", language: "textile" },
  { label: ".pdf", value: "pdf", language: "textile" },
  { label: ".txt", value: "txt", language: "textile" },
  { label: ".md", value: "md", language: "markdown" },
  { label: ".py", value: "py", language: "python" },
  { label: ".rs", value: "rs", language: "rust" },
  { label: ".js", value: "js", language: "javascript" },
  { label: ".ts", value: "ts", language: "typescript" },
  { label: ".tsx", value: "tsx", language: "tsx" },
  { label: ".html", value: "html", language: "html" },
  { label: ".css", value: "css", language: "css" },
  { label: ".json", value: "json", language: "json" },
  { label: ".xml", value: "xml", language: "xml" },
  { label: ".java", value: "java", language: "java" },
  { label: ".php", value: "php", language: "php" },
  { label: ".cpp", value: "cpp", language: "cpp" },
  { label: ".c", value: "c", language: "c" },
  { label: ".go", value: "go", language: "go" },
  { label: ".rb", value: "rb", language: "ruby" },
  { label: ".swift", value: "swift", language: "swift" },
  { label: ".kt", value: "kt", language: "kotlin" },
  { label: ".cs", value: "cs", language: "textile" },
  { label: ".vb", value: "vb", language: "textile" },
  { label: ".scala", value: "scala", language: "textile" },
  { label: ".pl", value: "pl", language: "textile" },
  { label: ".r", value: "r", language: "textile" },
  { label: ".lua", value: "lua", language: "textile" },
  { label: ".sql", value: "sql", language: "sql" },
  { label: ".sh", value: "sh", language: "textile" },
  { label: ".ps1", value: "ps1", language: "textile" },
  { label: ".bat", value: "bat", language: "textile" },
];
