import { useAuth } from "../context/AuthContext"

export function Settings(){

    const {user} = useAuth();

    return <>
  <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm tracking-widest text-gray-400 uppercase">
          Account Management
        </p>
        <h1 className="text-3xl font-bold text-gray-800 mt-2">
          Profile Settings
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl">
          Manage your personal information, security credentials, and workspace
          preferences in a unified environment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info Card */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                  👤
                </div>
                <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full text-xs">
                  ✎
                </button>
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-500">
                  Update your photo and personal details.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full mt-1 p-3 bg-gray-100 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full mt-1 p-3 bg-gray-100 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm text-gray-500">
                Professional Bio
              </label>
              <textarea
                rows="3"
                defaultValue="Product Designer and System Architect focusing on minimalist task management ecosystems."
                className="w-full mt-1 p-3 bg-gray-100 rounded-lg outline-none"
              />
            </div>

            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow hover:bg-indigo-700 transition">
              Update Profile
            </button>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow">
              <h3 className="font-medium">Theme Settings</h3>
              <p className="text-sm text-gray-500">System, Light, Dark</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow">
              <h3 className="font-medium">Email Digest</h3>
              <p className="text-sm text-gray-500">Daily summary active</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow">
              <h3 className="font-medium">Active Sessions</h3>
              <p className="text-sm text-gray-500">3 devices connected</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Change Password
            </h2>

            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full p-3 bg-gray-100 rounded-lg outline-none"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-3 bg-gray-100 rounded-lg outline-none"
              />
            </div>

            <button className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
              Reset Password
            </button>
          </div>

          {/* 2FA Card */}
          <div className="rounded-2xl p-6 text-white bg-gradient-to-r from-blue-400 to-indigo-600">
            <p className="text-xs uppercase tracking-wider opacity-80 mb-2">
              Security Tip
            </p>
            <h3 className="text-lg font-semibold mb-2">
              Enable 2FA
            </h3>
            <p className="text-sm opacity-90 mb-4">
              Add an extra layer of security to your workspace account.
            </p>
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium">
              Setup now →
            </button>
          </div>
        </div>
      </div>
    </div>
    
    </>
}