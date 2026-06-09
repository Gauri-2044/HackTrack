import { generateToken } from "../config/jwt.js";
import bcrypt from 'bcrypt'; //for code hashing
import { getTeamByNameRepo, createTeamRepo } from "../repositories/team.repository.js";


export async function loginTeam(req, res) {
  try {
    const { teamName, teamCode } = req.body;

    if (!teamName || !teamCode) {
      return res.status(400).json({
        success: false,
        message: "Missing teamName or teamCode.",
      });
    }

    const team = await getTeamByNameRepo(teamName);

    if (!team) {
      return res.status(401).json({
        success: false,
        message: "No team found with that name.",
      });
    }

    //verify password match
    let isMatch = await bcrypt.compare(teamCode, team.teamCode);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password/Code not matched.",
      });
    }

    const token = generateToken(team);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        token: token,
        team: team,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

export function handleLogin(req, res) {
  return res.status(200).json({ message: "Login page GET request placeholder" });
}

export async function registerTeam(req, res) {
  try {
    const { teamName, teamCode } = req.body;

    if (!teamName || !teamCode) {
      return res.status(400).json({
        success: false,
        message: "Missing teamName or teamCode.",
      });
    }

    const existingTeam = await getTeamByNameRepo(teamName);
    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: "Team name is already registered.",
      });
    }

    //hashed code 
    const hashedCode = await bcrypt.hash(teamCode, 10);

    const newTeam = await createTeamRepo({
      teamName,
      teamCode: hashedCode,
    });

    return res.status(201).json({
      success: true,
      message: "Team registered successfully.",
      data: newTeam,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

export function handleRegister(req, res) {
  return res.status(200).json({ message: "Register page GET request placeholder" });
}