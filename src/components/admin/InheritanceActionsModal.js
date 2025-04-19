"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { FiX, FiCopy, FiShield, FiCheckSquare } from "react-icons/fi";

const InheritanceActionsModal = ({
  role,
  allRoles,
  onClose,
  onCopyPermissions,
  onGrantFullAccess,
}) => {
  const [sourceRoleId, setSourceRoleId] = useState("");
  const [actionType, setActionType] = useState("copy"); // 'copy' or 'full'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (actionType === "copy") {
        if (!sourceRoleId) {
          throw new Error("Pilih role sumber untuk menyalin permission");
        }
        await onCopyPermissions(sourceRoleId, role.id);
      } else if (actionType === "full") {
        await onGrantFullAccess(role.id);
      }

      onClose();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto transition-opacity bg-gray-500 bg-opacity-75">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Modal container */}
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Modal header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FiShield className="mr-2" />
              Tindakan Permission
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Modal content */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4">
              {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Target
                </label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="font-medium">{role?.name}</p>
                  {role?.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {role.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Tindakan
                </label>
                <div className="space-y-3">
                  <div
                    className={`p-3 border rounded-md cursor-pointer ${
                      actionType === "copy"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setActionType("copy")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          actionType === "copy"
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {actionType === "copy" && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">
                          Salin Permission dari Role Lain
                        </p>
                        <p className="text-sm text-gray-500">
                          Menyalin permission dari role lain ke role ini tanpa
                          membuat relasi inheritance
                        </p>
                      </div>
                    </div>

                    {actionType === "copy" && (
                      <div className="mt-3">
                        <label
                          htmlFor="sourceRoleId"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Role Sumber
                        </label>
                        <select
                          id="sourceRoleId"
                          value={sourceRoleId}
                          onChange={(e) => setSourceRoleId(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Pilih Role Sumber</option>
                          {allRoles
                            .filter((r) => r.id !== role?.id) // Filter out current role
                            .map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div
                    className={`p-3 border rounded-md cursor-pointer ${
                      actionType === "full"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setActionType("full")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          actionType === "full"
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {actionType === "full" && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Berikan Akses Penuh</p>
                        <p className="text-sm text-gray-500">
                          Memberikan semua permission pada semua fitur ke role
                          ini
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-md text-sm text-yellow-800">
                <p className="font-medium">Catatan penting:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>
                    Tindakan ini akan <strong>menambahkan</strong> permission ke
                    role, bukan menggantikan
                  </li>
                  <li>Permission yang sudah ada tidak akan terhapus</li>
                  <li>
                    Untuk memberikan akses penuh, semua kombinasi fitur dan
                    permission akan ditambahkan
                  </li>
                  <li>
                    Berbeda dengan inheritance, tindakan ini hanya menyalin
                    permission saat ini dan tidak membuat relasi permanen
                  </li>
                </ul>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
              <Button variant="light" type="button" onClick={onClose}>
                Batal
              </Button>

              <Button
                variant="primary"
                type="submit"
                isLoading={loading}
                className="flex items-center"
              >
                {actionType === "copy" ? (
                  <>
                    <FiCopy className="mr-2" />
                    Salin Permission
                  </>
                ) : (
                  <>
                    <FiCheckSquare className="mr-2" />
                    Berikan Akses Penuh
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InheritanceActionsModal;
