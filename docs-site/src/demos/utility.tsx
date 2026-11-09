import { Button, IconButton, IconMoon, IconSun, IconTrash, SegmentedControl, Text, useTheme, VisuallyHidden } from "@keel/components";
import { Row } from "../docs/kit";

/* ---------------- VisuallyHidden ---------------- */
export function VisuallyHiddenDemo() {
  return (
    <Row gap={16}>
      <Button variant="danger-ghost" leading={<IconTrash />}>Delete<VisuallyHidden> invoice INV-1042</VisuallyHidden></Button>
      <Text tone="muted">Screen readers hear “Delete invoice INV-1042”.</Text>
    </Row>
  );
}

/* ---------------- Theme ---------------- */
export function ThemeDemo() {
  const { mode, resolved, setMode, toggle } = useTheme();
  return (
    <Row gap={16}>
      <SegmentedControl label="Theme" value={mode} onValueChange={(v) => setMode(v as "light" | "dark" | "system")} items={[{ value: "light", label: "Light", icon: <IconSun /> }, { value: "dark", label: "Dark", icon: <IconMoon /> }, { value: "system", label: "System" }]} />
      <IconButton label="Toggle theme" variant="secondary" onClick={toggle}>{resolved === "dark" ? <IconSun /> : <IconMoon />}</IconButton>
      <Text tone="muted">Resolved: {resolved}</Text>
    </Row>
  );
}
