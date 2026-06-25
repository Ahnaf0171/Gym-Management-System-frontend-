// components/shared/UserTable.jsx
import { useState, useEffect, useCallback } from "react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { UserCreateForm } from "@/components/shared/UserCreateForm";
import { getUsers, updateUser, deleteUser } from "@/services/userService";
import { API_BASE_URL } from "@/utils/constants";
import { getRoleLabel } from "@/utils/roleUtils";

const ROLE_COLORS = {
  gym_manager: "var(--color-info)",
  trainer: "var(--color-warning)",
  member: "var(--color-success)",
};

const TAB_LABELS = {
  gym_manager: "Managers",
  trainer: "Trainers",
  member: "Members",
};

export function UserTable({
  tabs = [],
  canCreate = false,
  defaultTab = null,
  createTabs = null,
}) {
  const [activeTab, setActiveTab] = useState(
    defaultTab && tabs.includes(defaultTab) ? defaultTab : (tabs[0] ?? null),
  );
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editMobileNumber, setEditMobileNumber] = useState("");
  const [editProfilePicture, setEditProfilePicture] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers(1, activeTab, search);
      setUsers(data.results ?? []);
      setTotal(data.count ?? 0);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setSearchInput("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditProfilePicture(file);
      setEditPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const formData = new FormData();
      formData.append("email", editEmail);
      formData.append("username", editUsername);
      if (editGender) formData.append("gender", editGender);
      if (editAge) formData.append("age", editAge);
      formData.append("mobile_number", editMobileNumber);
      if (editProfilePicture)
        formData.append("profile_picture", editProfilePicture);

      await updateUser(editUser.id, formData);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      const data = err.response?.data;
      const firstError =
        data?.email?.[0] ||
        data?.username?.[0] ||
        data?.mobile_number?.[0] ||
        data?.non_field_errors?.[0] ||
        "Something went wrong";
      setEditError(firstError);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      fetchUsers();
    } catch {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      key: "email",
      label: "Email",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{
              backgroundColor: ROLE_COLORS[row.role] ?? "var(--color-primary)",
            }}
          >
            {row.email?.[0]?.toUpperCase()}
          </div>
          <span className="font-medium text-[var(--color-text-primary)]">
            {row.email}
          </span>
        </div>
      ),
    },
    {
      key: "mobile_number",
      label: "Contact Number",
      render: (row) => (
        <span className="text-[var(--color-text-secondary)]">
          {row.mobile_number ?? "—"}
        </span>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            color: ROLE_COLORS[row.role],
            backgroundColor: `${ROLE_COLORS[row.role]}20`,
          }}
        >
          {getRoleLabel(row.role)}
        </span>
      ),
    },
    {
      key: "gym_branch_name",
      label: "Branch",
      render: (row) => (
        <span className="text-[var(--color-text-secondary)]">
          {row.gym_branch_name ?? "—"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Joined",
      render: (row) => (
        <span className="text-[var(--color-text-secondary)]">
          {new Date(row.created_at).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setEditUser(row);
              setEditEmail(row.email);
              setEditUsername(row.username ?? "");
              setEditGender(row.gender ?? "");
              setEditAge(row.age ?? "");
              setEditMobileNumber(row.mobile_number ?? "");
              setEditProfilePicture(null);
              setEditPreviewUrl(
                row.profile_picture
                  ? `${API_BASE_URL}${row.profile_picture}`
                  : null,
              );
              setEditError("");
            }}
            className="text-xs px-3 py-1.5"
            style={{ backgroundColor: "var(--color-info)" }}
          >
            Edit
          </Button>
          <Button
            onClick={() => setDeleteTarget(row)}
            className="text-xs px-3 py-1.5"
            style={{ backgroundColor: "var(--color-danger)" }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const activeLabel = TAB_LABELS[activeTab] ?? "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Users
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {total} {activeLabel.toLowerCase()} found
          </p>
        </div>
        {canCreate && (!createTabs || createTabs.includes(activeTab)) && (
          <Button onClick={() => setCreateOpen(true)}>
            + New {activeLabel.slice(0, -1)}
          </Button>
        )}
      </div>

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer
                ${
                  activeTab === tab
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
        <Input
          placeholder="Search by email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="w-8 h-8" />
        </div>
      ) : users.length === 0 ? (
        <EmptyState message={`No ${activeLabel.toLowerCase()} found`} />
      ) : (
        <Table columns={columns} data={users} />
      )}

      {/* Create Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title={`Create New ${activeLabel.slice(0, -1)}`}
      >
        <UserCreateForm
          onSuccess={() => {
            setCreateOpen(false);
            fetchUsers();
          }}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit User"
      >
        <form onSubmit={handleEdit} className="flex flex-col gap-4">
          {editPreviewUrl && (
            <img
              src={editPreviewUrl}
              alt="Preview"
              className="w-16 h-16 rounded-full object-cover mx-auto border border-[var(--color-border)]"
            />
          )}

          <Input
            label="Username"
            type="text"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">
              Gender
            </label>
            <select
              value={editGender}
              onChange={(e) => setEditGender(e.target.value)}
              className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-xl bg-[var(--color-surface-2)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] transition-all duration-200"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <Input
            label="Age"
            type="number"
            value={editAge}
            onChange={(e) => setEditAge(e.target.value)}
            min="1"
          />

          <Input
            label="Mobile Number"
            type="tel"
            value={editMobileNumber}
            onChange={(e) => setEditMobileNumber(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-[var(--color-text-primary)]"
            />
          </div>

          {editError && (
            <p className="text-xs text-[var(--color-danger)]">{editError}</p>
          )}
          <Button type="submit" className="w-full" disabled={editLoading}>
            {editLoading ? (
              <Spinner className="w-4 h-4 mx-auto" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete User"
      >
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[var(--color-text-primary)]">
            {deleteTarget?.email}
          </span>
          ?
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => setDeleteTarget(null)}
            className="flex-1 bg-[var(--color-surface-2)] text-[var(--color-text-primary)]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="flex-1"
            style={{ backgroundColor: "var(--color-danger)" }}
            disabled={deleteLoading}
          >
            {deleteLoading ? <Spinner className="w-4 h-4 mx-auto" /> : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
