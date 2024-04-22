import type { EditorView } from "@codemirror/view";
import { Decoration } from "@codemirror/view";
import { ViewPlugin, type DecorationSet, type ViewUpdate } from "@codemirror/view";
import { type Extension, Facet, RangeSetBuilder } from "@uiw/react-codemirror";

const linesToHighlight = Facet.define<number[], number[]>({
  combine: (values) => {
    const lines = [];
    for (let i = 0; i < values.length; i++) {
      lines.push(...values[i]);
    }
    return lines;
  },
});

const highlightDecoration = Decoration.line({
  attributes: { class: "cm-activeLine" },
});

function applyHighlight(view: EditorView) {
  const lines = view.state.facet(linesToHighlight);
  const builder = new RangeSetBuilder<Decoration>();

  for (const { from, to } of view.viewportLineBlocks) {
    for (let pos = from; pos <= to; ) {
      const line = view.state.doc.lineAt(pos);
      if (lines.includes(line.number)) {
        builder.add(line.from, line.from, highlightDecoration);
      }
      pos = line.to + 1;
    }
  }
  return builder.finish();
}

const showHighlight = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = applyHighlight(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged)
        this.decorations = applyHighlight(update.view);
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);

export function highlightLines(options: { lines: number[] }): Extension {
  return [linesToHighlight.of(options.lines), showHighlight];
}
