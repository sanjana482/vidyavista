// Any "Enquire" button on the profile page calls this to open the Apply popup
// (optionally pre-selecting a class).
export function openEnquiry(cls?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("vv-apply", { detail: { cls } }));
  }
}
