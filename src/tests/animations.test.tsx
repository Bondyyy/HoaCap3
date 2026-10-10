// @vitest-environment jsdom
import { afterEach, it, expect, vi } from "vitest";
import {
  renderHook,
  act,
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import { useAnimation } from "../hooks/useAnimation";
import Electrophoresis from "../components/simulations/Electrophoresis";
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
it("timeline pause/reset/replay and condition changes invalidate previous progress", () => {
  vi.useFakeTimers();
  const { result, rerender } = renderHook(
    ({ key }) => useAnimation(key, 1000),
    { initialProps: { key: "first" } },
  );
  act(() => result.current.play());
  act(() => vi.advanceTimersByTime(400));
  expect(result.current.progress).toBeCloseTo(0.4);
  act(() => result.current.pause());
  act(() => vi.advanceTimersByTime(200));
  expect(result.current.progress).toBeCloseTo(0.4);
  act(() => result.current.reset());
  expect(result.current.progress).toBe(0);
  act(() => result.current.replay());
  act(() => vi.advanceTimersByTime(1000));
  expect(result.current.progress).toBe(1);
  expect(result.current.playing).toBe(false);
  rerender({ key: "changed" });
  expect(result.current.progress).toBe(0);
  expect(result.current.playing).toBe(false);
});
it("electrophoresis slider resets the rendered progress", () => {
  vi.useFakeTimers();
  render(<Electrophoresis />);
  fireEvent.click(screen.getByRole("button", { name: "Chạy mô phỏng" }));
  act(() => vi.advanceTimersByTime(4000));
  expect(
    (screen.getByRole("progressbar") as HTMLProgressElement).value,
  ).toBeGreaterThan(0);
  fireEvent.change(screen.getByRole("slider"), { target: { value: "12" } });
  expect((screen.getByRole("progressbar") as HTMLProgressElement).value).toBe(
    0,
  );
  expect(screen.getAllByText("Điện tích TB âm → anode (+)")).toHaveLength(3);
});
