import { generateToken } from "../config/jwt.js";
import bcrypt from 'bcrypt'; //for code hashing
import { getTeamByIdRepo, createTeamRepo, getTeamByNameRepo } from "../repositories/team.repository.js";

import { createMemberRepo, getMemberByEmailRepo } from '../repositories/member.repository.js';


export async function loginTeam(req, res) {
  try {
    const { teamName, teamCode, email, password } = req.body;

    if (!teamName || !teamCode || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing Data.",
      });
    }

    // 2. Find Member by Email
    const member = await getMemberByEmailRepo(email);
    if (!member) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }
    // 3. Verify Member Password
    const isPasswordMatch = await bcrypt.compare(password, member.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }
    // 4. Find the associated Team
    const team = await getTeamByIdRepo(member.teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Associated team not found.",
      });
    }
    // 5. Verify the Team Code
    const isTeamCodeMatch = await bcrypt.compare(teamCode, team.teamCode);
    if (!isTeamCodeMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Team Code.",
      });
    }


    const token = generateToken(team, member);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        token: token,
        team: team,
        member: {
          id: member.id,
          userName: member.userName,
          email: member.email,
          role: member.role
        }
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
}


export function handleLogin(req, res) {
  return res.status(200).json({ message: "Login page GET request placeholder" });
}

export async function registerTeam(req, res) {
  try {
    const { teamName, teamCode, name, email, password } = req.body;
    // Validate all fields
    if (!teamName || !teamCode || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required team or member registration details.",
      });
    }
    // Check if team already exists
    const existingTeam = await getTeamByNameRepo(teamName);
    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: "Team name is already registered.",
      });
    }
    // Hash the team code/password
    const hashedCode = await bcrypt.hash(teamCode, 10);
    // Create the Team
    const newTeam = await createTeamRepo({
      teamName,
      teamCode: hashedCode,
    });
    // Hash the user's personal password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the first Member (as Team Lead) linked to the new team's ID
    const newMember = await createMemberRepo({
      userName: name,
      email: email,
      password: hashedPassword,
      teamId: newTeam.id,
      role: "Team Lead" // Assigns them as the lead since they created the team
    });
    return res.status(201).json({
      success: true,
      message: "Team and leader account registered successfully.",
      data: {
        team: newTeam,
        member: {
          id: newMember.id,
          userName: newMember.userName,
          email: newMember.email,
          role: newMember.role
        }
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

export function handleRegister(req, res) {
  return res.status(200).json({ message: "Register page GET request placeholder" });
}