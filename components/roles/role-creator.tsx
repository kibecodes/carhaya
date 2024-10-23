"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// type for the permissions
type Permission = string;

// Type for roles and their permissions
interface RolePermission {
  [role: string]: Permission[]; // Allows any string as a role name with an array of permissions
}

const predefinedRoles: RolePermission = {
  Manager: [
    // "Can create a new role", 
    "Can approve applications", 
    "Can reject applications", 
    "Can add vehicles", 
    "Can delete vehicles", 
    "Can add users", 
    "Can delete users", 
    "Can view bookings", 
    "Can view vehicles"
  ],
  Operator: ["Can view bookings", "Can view vehicles"]
}

const allPermissions = [
  "Can create a new role",
  "Can approve applications",
  "Can reject applications",
  "Can add vehicles",
  "Can delete vehicles",
  "Can add users",
  "Can delete users",
  "Can view bookings",
  "Can view vehicles",
]

const RoleCreatorPage = () => {
  const [selectedRole, setSelectedRole] = useState<"Manager" | "Operator">("Manager")
  const [customPermission, setCustomPermission] = useState("")
  const [customRole, setCustomRole] = useState("")
  const [permissions, setPermissions] = useState(predefinedRoles[selectedRole])

  // Update permissions based on selected role
  const handleRoleChange = (role: "Manager" | "Operator") => {
    setSelectedRole(role)
    setPermissions(predefinedRoles[role])
  }

  // Toggle permission on or off
  const togglePermission = (permission: string) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter((p) => p !== permission))
    } else {
      setPermissions([...permissions, permission])
    }
  }

  // Add custom permission
  const handleAddCustomPermission = () => {
    if (customPermission && !permissions.includes(customPermission)) {
      setPermissions([...permissions, customPermission])
      setCustomPermission("")
    }
  }

  // Add custom role
  const handleAddCustomRole = () => {
    if (customRole && !Object.keys(predefinedRoles).includes(customRole)) {
      predefinedRoles[customRole] = [] // Initialize permissions for the new role
      setCustomRole("") // Reset custom role input
    }
  }

  return (
    <div className="pt-5">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create Role</CardTitle>
          <CardDescription>Create new role and assign privileges and permissions.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-4">
                <Label htmlFor="role-select">Select Role</Label>
                <Select onValueChange={handleRoleChange} value={selectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Operator">Operator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {allPermissions.map((permission, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Checkbox
                      id={`permission-${idx}`}
                      checked={permissions.includes(permission)}
                      onCheckedChange={() => togglePermission(permission)}
                    />
                    <Label htmlFor={`permission-${idx}`}>{permission}</Label>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Card className="border p-4">
                    <CardHeader>
                        <CardTitle>Preview Role Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>Role Name:</strong> {selectedRole}</p>
                        <p><strong>Assigned Permissions:</strong></p>
                        <ul className="list-disc pl-5">
                        {permissions.map((permission, idx) => (
                            <li key={idx}>{permission}</li>
                        ))}
                        </ul>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline">Cancel</Button>
                        <Button>Create</Button>
                    </CardFooter>
                </Card>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <Label htmlFor="new-role">Add New Role (Superuser Only)</Label>
                <Input
                  id="new-role"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="New Role"
                />
                <Button
                  type="button"
                  className="mt-2"
                  onClick={handleAddCustomRole}
                >
                  Add Role
                </Button>
              </div>

              <div className="mb-4">
                <Label htmlFor="new-permission">Add New Permission (Superuser Only)</Label>
                <Input
                  id="new-permission"
                  value={customPermission}
                  onChange={(e) => setCustomPermission(e.target.value)}
                  placeholder="New Permission"
                />
                <Button
                  type="button"
                  className="mt-2"
                  onClick={handleAddCustomPermission}
                >
                  Add Permission
                </Button>
              </div>

            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RoleCreatorPage
