// components/shared/UserTable.jsx
import { useState, useEffect, useCallback } from "react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { UserCreateForm } from "@/components/shared/UserCreateForm";
import EditProfileModal from "@/components/shared/EditProfileModal";
import { getUsers, deleteUser } from "@/services/userService";
import { getRoleLabel } from "@/utils/roleUtils";
import { Pencil, Trash2 } from "lucide-react";

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
  const [editTarget, setEditTarget] = useState(null);
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

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      await fetchUsers();
    } catch {
      // error handle
    } finally {
      setDeleteLoading(false);
    }
  };

  const activeLabel = TAB_LABELS[activeTab] ?? "";

  return (
    <div className="flex flex-col gap-6 mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)]"
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
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer
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

      {/* Table / Card list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="w-8 h-8" />
        </div>
      ) : users.length === 0 ? (
        <EmptyState message={`No ${activeLabel.toLowerCase()} found`} />
      ) : (
        <>
          {/* ── Desktop table (lg+) ── */}
          <div className="hidden lg:block w-full">
            <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden">
              <table className="w-full table-fixed text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-secondary)] w-[30%]">
                      User
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-secondary)] w-[18%]">
                      Contact
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-secondary)] w-[16%]">
                      Role
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-secondary)] w-[20%]">
                      Branch
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-secondary)] w-[10%]">
                      Joined
                    </th>
                    <th className="w-[6%]" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {users.map((row) => (
                    <tr
                      key={row.id}
                      className="bg-[var(--color-surface-1)] hover:bg-[var(--color-surface-2)] transition-colors"
                    >
                      {/* User — avatar + email + username stacked */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{
                              backgroundColor:
                                ROLE_COLORS[row.role] ?? "var(--color-primary)",
                            }}
                          >
                            {(row.username || row.email)?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-medium text-[var(--color-text-primary)] break-all leading-tight">
                              {row.email}
                            </span>
                            {row.username && (
                              <span className="text-[11px] text-[var(--color-text-secondary)] truncate">
                                {row.username}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-[var(--color-text-secondary)]">
                          {row.mobile_number ?? "—"}
                        </span>
                      </td>

                      {/* Role badge */}
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                          style={{
                            color: ROLE_COLORS[row.role],
                            backgroundColor: `${ROLE_COLORS[row.role]}20`,
                          }}
                        >
                          {getRoleLabel(row.role)}
                        </span>
                      </td>

                      {/* Branch */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-[var(--color-text-secondary)] break-words">
                          {row.gym_branch_name ?? "—"}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-[var(--color-text-secondary)] whitespace-nowrap">
                          {new Date(row.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "2-digit",
                            },
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditTarget(row)}
                            className="p-1 rounded-lg text-[var(--color-info)] hover:bg-[var(--color-surface-2)] transition-colors"
                            aria-label="Edit user"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(row)}
                            className="p-1 rounded-lg text-[var(--color-danger)] hover:bg-[var(--color-surface-2)] transition-colors"
                            aria-label="Delete user"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:hidden flex flex-col gap-2">
            {users.map((row) => (
              <div
                key={row.id}
                className="flex items-start gap-3 px-4 py-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)]"
              >
                {/* Avatar — top aligned */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 mt-0.5"
                  style={{
                    backgroundColor:
                      ROLE_COLORS[row.role] ?? "var(--color-primary)",
                  }}
                >
                  {(row.username || row.email)?.[0]?.toUpperCase()}
                </div>

                {/* Info — left aligned */}
                <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate w-full">
                    {row.username || row.email}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] truncate w-full">
                    {row.email}
                  </p>
                  <span
                    className="text-[11px] font-medium py-0.5 rounded-full whitespace-nowrap mt-0.5"
                    style={{
                      color: ROLE_COLORS[row.role],
                      backgroundColor: `${ROLE_COLORS[row.role]}20`,
                    }}
                  >
                    {getRoleLabel(row.role)}
                  </span>
                  {row.gym_branch_name && (
                    <span className="text-[11px] text-[var(--color-text-secondary)] truncate w-full">
                      {row.gym_branch_name}
                    </span>
                  )}
                </div>

                {/* Actions — top aligned */}
                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                  <button
                    onClick={() => setEditTarget(row)}
                    className="p-1.5 rounded-lg text-[var(--color-info)] hover:bg-[var(--color-surface-2)] transition-colors"
                    aria-label="Edit user"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(row)}
                    className="p-1.5 rounded-lg text-[var(--color-danger)] hover:bg-[var(--color-surface-2)] transition-colors"
                    aria-label="Delete user"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
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

      {/* Edit Modal — EditProfileModal reuse */}
      {editTarget && (
        <EditProfileModal
          targetUser={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            setEditTarget(null);
            fetchUsers();
          }}
        />
      )}

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
