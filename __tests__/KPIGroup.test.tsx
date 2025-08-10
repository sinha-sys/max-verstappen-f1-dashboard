import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KPIGroup } from "@/app/(dashboard)/_components/KPIGroup";
import type { CareerTotals } from "@/lib/types";

const mockCareer: CareerTotals = {
  driver: "Max Verstappen",
  asOfDate: "2025-08-09",
  starts: 223,
  wins: 65,
  podiums: 117,
  poles: 44,
  fastestLaps: 34,
  points: 3210.5,
  dnfs: 33,
  championships: 4,
};

describe("KPIGroup", () => {
  it("renders all KPI cards", () => {
    render(<KPIGroup career={mockCareer} />);
    
    // Check if all KPI values are displayed
    expect(screen.getByText("223")).toBeInTheDocument(); // Starts
    expect(screen.getByText("65")).toBeInTheDocument();  // Wins
    expect(screen.getByText("117")).toBeInTheDocument(); // Podiums
    expect(screen.getByText("44")).toBeInTheDocument();  // Poles
    expect(screen.getByText("34")).toBeInTheDocument();  // Fastest Laps
    expect(screen.getByText("3,210.5")).toBeInTheDocument(); // Points
    expect(screen.getByText("33")).toBeInTheDocument();  // DNFs
    expect(screen.getByText("4")).toBeInTheDocument();   // Championships
  });

  it("renders all KPI labels", () => {
    render(<KPIGroup career={mockCareer} />);
    
    expect(screen.getByText("Starts")).toBeInTheDocument();
    expect(screen.getByText("Wins")).toBeInTheDocument();
    expect(screen.getByText("Podiums")).toBeInTheDocument();
    expect(screen.getByText("Poles")).toBeInTheDocument();
    expect(screen.getByText("Fastest Laps")).toBeInTheDocument();
    expect(screen.getByText("Points")).toBeInTheDocument();
    expect(screen.getByText("DNFs")).toBeInTheDocument();
    expect(screen.getByText("Championships")).toBeInTheDocument();
  });

  it("applies correct CSS classes for responsive layout", () => {
    const { container } = render(<KPIGroup career={mockCareer} />);
    
    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer).toHaveClass("grid", "grid-cols-2", "gap-4", "sm:grid-cols-4", "lg:grid-cols-8");
  });
});
