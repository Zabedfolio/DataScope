import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Navbar } from "./Navbar";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/explorer",
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the DataScope branding logo and name", () => {
    render(<Navbar />);
    expect(screen.getByLabelText("DataScope Homepage")).toBeInTheDocument();
    expect(screen.getAllByText("DataScope").length).toBeGreaterThanOrEqual(1);
  });

  it("renders primary navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Datasets")).toBeInTheDocument();
    expect(screen.getByText("Data Explorer")).toBeInTheDocument();
  });

  it("renders both Log In and primary Get Started gradient action buttons", () => {
    render(<Navbar />);
    expect(screen.getByText("Log In")).toBeInTheDocument();
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("renders the mobile hamburger menu button with accessible attributes", () => {
    render(<Navbar />);
    const menuBtn = screen.getByLabelText("Toggle navigation menu");
    expect(menuBtn).toBeInTheDocument();
    expect(menuBtn).toHaveAttribute("aria-expanded", "false");
    expect(menuBtn).toHaveAttribute("aria-controls", "mobile-nav-drawer");
  });

  it("opens the mobile drawer dialog on hamburger click and handles close", () => {
    render(<Navbar />);
    const menuBtn = screen.getByLabelText("Toggle navigation menu");

    // Click to open
    fireEvent.click(menuBtn);
    expect(menuBtn).toHaveAttribute("aria-expanded", "true");

    const drawer = screen.getByRole("dialog", {
      name: "Mobile Navigation Menu",
    });
    expect(drawer).toBeInTheDocument();

    // Drawer should also contain Log In and Get Started
    expect(drawer).toHaveTextContent("Log In");
    expect(drawer).toHaveTextContent("Get Started");

    // Click close button inside drawer
    const closeBtn = screen.getByLabelText("Close navigation menu");
    fireEvent.click(closeBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the mobile drawer when Escape key is pressed", () => {
    render(<Navbar />);
    const menuBtn = screen.getByLabelText("Toggle navigation menu");

    // Open
    fireEvent.click(menuBtn);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
