// actions/check-user.ts
"use server";

import { getStaffUserByUserName } from "@/data/user";

export interface CheckUserResponse {
  staff: boolean;
  isadmin: boolean;
  error?: string;
}

export const checkUserPermissions = async (username: string): Promise<CheckUserResponse> => {
  if (!username) {
    return { staff: false, isadmin: false, error: "Username is required" };
  }

  try {
    const user = await getStaffUserByUserName(username);
    if (!user) {
      console.log("-- User not found in checkUserPermissions -- : ", { username });
      return { staff: false, isadmin: false };
    }
    console.log("-- Fetched permissions in checkUserPermissions -- : ", {
      username,
      staff: user.Staff,
      isadmin: user.ISADMIN,
    });
    return { staff: user.Staff, isadmin: user.ISADMIN };
  } catch (error) {
    console.error("-- Error checking user permissions -- : ", { username, error });
    return { staff: false, isadmin: false, error: "Server error" };
  }
};