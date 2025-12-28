import { DashboardService } from "../services/dashboard.service.js";

const dashboardService = new DashboardService();

export async function getDashboardStats(_, res) {
  try {
    const stats = await dashboardService.getStats();
    res.status(200).json(stats);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
}