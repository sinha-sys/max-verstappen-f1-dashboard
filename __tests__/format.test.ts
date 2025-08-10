import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatDecimal,
  formatPercentage,
  formatPoints,
  formatDate,
  formatOrdinal,
  calculateWinRate,
  calculatePodiumRate,
  calculatePoleRate,
  calculateDnfRate,
  calculateAvgPointsPerStart,
} from "@/lib/format";

describe("Format utilities", () => {
  describe("formatNumber", () => {
    it("should format integers with commas", () => {
      expect(formatNumber(1000)).toBe("1,000");
      expect(formatNumber(1234567)).toBe("1,234,567");
      expect(formatNumber(42)).toBe("42");
    });
  });

  describe("formatDecimal", () => {
    it("should format decimals with specified precision", () => {
      expect(formatDecimal(3.14159, 2)).toBe("3.14");
      expect(formatDecimal(42.7, 1)).toBe("42.7");
      expect(formatDecimal(100, 0)).toBe("100");
    });
  });

  describe("formatPercentage", () => {
    it("should format percentages correctly", () => {
      expect(formatPercentage(0.75, 1)).toBe("75.0%");
      expect(formatPercentage(0.333, 2)).toBe("33.30%");
      expect(formatPercentage(1, 0)).toBe("100%");
    });
  });

  describe("formatPoints", () => {
    it("should format whole numbers without decimals", () => {
      expect(formatPoints(100)).toBe("100");
      expect(formatPoints(250)).toBe("250");
    });

    it("should format half points with decimals", () => {
      expect(formatPoints(25.5)).toBe("25.5");
      expect(formatPoints(100.5)).toBe("100.5");
    });
  });

  describe("formatOrdinal", () => {
    it("should add correct ordinal suffixes", () => {
      expect(formatOrdinal(1)).toBe("1st");
      expect(formatOrdinal(2)).toBe("2nd");
      expect(formatOrdinal(3)).toBe("3rd");
      expect(formatOrdinal(4)).toBe("4th");
      expect(formatOrdinal(21)).toBe("21st");
      expect(formatOrdinal(22)).toBe("22nd");
      expect(formatOrdinal(23)).toBe("23rd");
      expect(formatOrdinal(24)).toBe("24th");
    });
  });

  describe("Rate calculations", () => {
    it("should calculate win rate correctly", () => {
      expect(calculateWinRate(10, 20)).toBe(0.5);
      expect(calculateWinRate(0, 10)).toBe(0);
      expect(calculateWinRate(5, 0)).toBe(0);
    });

    it("should calculate podium rate correctly", () => {
      expect(calculatePodiumRate(15, 20)).toBe(0.75);
      expect(calculatePodiumRate(0, 10)).toBe(0);
    });

    it("should calculate pole rate correctly", () => {
      expect(calculatePoleRate(5, 20)).toBe(0.25);
      expect(calculatePoleRate(0, 10)).toBe(0);
    });

    it("should calculate DNF rate correctly", () => {
      expect(calculateDnfRate(2, 20)).toBe(0.1);
      expect(calculateDnfRate(0, 10)).toBe(0);
    });

    it("should calculate average points per start", () => {
      expect(calculateAvgPointsPerStart(300, 20)).toBe(15);
      expect(calculateAvgPointsPerStart(0, 10)).toBe(0);
      expect(calculateAvgPointsPerStart(100, 0)).toBe(0);
    });
  });
});
