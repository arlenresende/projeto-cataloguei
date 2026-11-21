import { describe, expect, it } from "vitest";
import { getThemeConfig, resolveThemeColors } from "./config";
import { getSurfaceTextColor } from "./contrast";
import { storeUpdateSchema } from "@/lib/schemas/store";
import { buildStoreUpdateData } from "@/lib/store";

describe("store surface colors", () => {
  it("keeps surface overrides independent of buttons and other surfaces", () => {
    const config = getThemeConfig("DEFAULT");
    const base = resolveThemeColors(config, {});
    const colors = resolveThemeColors(config, { headerColor: "#000", footerColor: "#fff" });
    expect(colors).toEqual({ ...base, header: "#000", footer: "#fff" });
    expect(resolveThemeColors(config, { secondaryColor: "#123456" }).footer).toBe(base.footer);
    expect(resolveThemeColors(config, { headerColor: "", footerColor: "" })).toEqual(base);
  });

  it.each([['#fff', '#000000'], ['#000000', '#FFFFFF'], ['#777777', '#000000'], ['#123456', '#FFFFFF']])("chooses contrasting text for %s", (color, text) => {
    expect(getSurfaceTextColor(color)).toBe(text);
  });

  it("validates, persists and clears both colors without modifying omitted fields", () => {
    const input = storeUpdateSchema.parse({ headerColor: "#abc", footerColor: "#123456" });
    expect(buildStoreUpdateData(input)).toEqual(input);
    expect(storeUpdateSchema.safeParse({ headerColor: "red" }).success).toBe(false);
    expect(buildStoreUpdateData(storeUpdateSchema.parse({ headerColor: "", footerColor: "" }))).toEqual({ headerColor: null, footerColor: null });
    expect(buildStoreUpdateData({ name: "Loja" })).toEqual({ name: "Loja" });
  });
});
