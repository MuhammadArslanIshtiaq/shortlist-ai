'use client';

import { Settings, User, Bell, Shield, Database, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600">Manage your account settings and preferences.</p>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
            </div>
            <p className="text-gray-600 mb-4">Update your personal information and profile details.</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            <p className="text-gray-600 mb-4">Configure your notification preferences.</p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Manage Notifications
            </button>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Security</h2>
            </div>
            <p className="text-gray-600 mb-4">Manage your account security and privacy settings.</p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Security Settings
            </button>
          </div>

          {/* Data & Privacy */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Data & Privacy</h2>
            </div>
            <p className="text-gray-600 mb-4">Control your data and privacy preferences.</p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Privacy Settings
            </button>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Palette className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
            </div>
            <p className="text-gray-600 mb-4">Customize the look and feel of your dashboard.</p>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Customize Theme
            </button>
          </div>

          {/* AI Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">AI Configuration</h2>
            </div>
            <p className="text-gray-600 mb-4">Configure AI ranking and shortlisting preferences.</p>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
              AI Settings
            </button>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Settings Coming Soon</h3>
              <p className="text-blue-700">
                We're working on implementing comprehensive settings functionality. 
                This page will be fully functional in the next update.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 