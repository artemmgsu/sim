import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('SalesforceDashboards')

/**
 * Helper function to extract Salesforce instance URL from tokens
 */
function getInstanceUrl(idToken?: string, instanceUrl?: string): string {
  if (instanceUrl) return instanceUrl
  if (idToken) {
    try {
      const base64Url = idToken.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join('')
      )
      const decoded = JSON.parse(jsonPayload)
      if (decoded.profile) {
        const match = decoded.profile.match(/^(https:\/\/[^/]+)/)
        if (match) return match[1]
      } else if (decoded.sub) {
        const match = decoded.sub.match(/^(https:\/\/[^/]+)/)
        if (match && match[1] !== 'https://login.salesforce.com') return match[1]
      }
    } catch (error) {
      logger.error('Failed to decode Salesforce idToken', { error })
    }
  }
  throw new Error('Salesforce instance URL is required but not provided')
}

/**
 * List all available dashboards
 */
export const salesforceListDashboardsTool: ToolConfig<any, any> = {
  id: 'salesforce_list_dashboards',
  name: 'List Dashboards from Salesforce',
  description: 'Get a list of all available dashboards in Salesforce',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/dashboards`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },
  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok)
      throw new Error(data[0]?.message || data.message || 'Failed to list dashboards')
    return {
      success: true,
      output: {
        dashboards: data,
        metadata: { operation: 'list_dashboards' },
        success: true,
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'List of dashboards' },
  },
}

/**
 * Get dashboard metadata and details
 */
export const salesforceGetDashboardTool: ToolConfig<any, any> = {
  id: 'salesforce_get_dashboard',
  name: 'Get Dashboard from Salesforce',
  description: 'Get the metadata and structure of a specific dashboard',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    dashboardId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Dashboard ID (required)',
    },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/dashboards/${params.dashboardId}/describe`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },
  transformResponse: async (response, params) => {
    const data = await response.json()
    if (!response.ok) throw new Error(data[0]?.message || data.message || 'Failed to get dashboard')
    return {
      success: true,
      output: {
        dashboardId: params.dashboardId,
        dashboard: data,
        metadata: { operation: 'get_dashboard' },
        success: true,
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Dashboard details' },
  },
}

/**
 * Get dashboard results (refresh dashboard data)
 */
export const salesforceRefreshDashboardTool: ToolConfig<any, any> = {
  id: 'salesforce_refresh_dashboard',
  name: 'Refresh Dashboard in Salesforce',
  description: 'Refresh and get the latest data for a dashboard',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    dashboardId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Dashboard ID (required)',
    },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/dashboards/${params.dashboardId}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },
  transformResponse: async (response, params) => {
    const data = await response.json()
    if (!response.ok)
      throw new Error(data[0]?.message || data.message || 'Failed to refresh dashboard')
    return {
      success: true,
      output: {
        dashboardId: params.dashboardId,
        dashboardData: data,
        metadata: { operation: 'refresh_dashboard' },
        success: true,
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Refreshed dashboard data' },
  },
}

/**
 * Clone a dashboard
 */
export const salesforceCloneDashboardTool: ToolConfig<any, any> = {
  id: 'salesforce_clone_dashboard',
  name: 'Clone Dashboard in Salesforce',
  description: 'Create a copy of an existing dashboard',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    dashboardId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Dashboard ID to clone (required)',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Name for the new dashboard (required)',
    },
    folderId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Folder ID where the cloned dashboard will be stored',
    },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/dashboards`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {
        name: params.name,
        sourceId: params.dashboardId,
      }
      if (params.folderId) {
        body.folderId = params.folderId
      }
      return body
    },
  },
  transformResponse: async (response, params) => {
    const data = await response.json()
    if (!response.ok)
      throw new Error(data[0]?.message || data.message || 'Failed to clone dashboard')
    return {
      success: true,
      output: {
        sourceDashboardId: params.dashboardId,
        newDashboardId: data.id,
        name: params.name,
        dashboard: data,
        metadata: { operation: 'clone_dashboard' },
        success: true,
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Cloned dashboard details' },
  },
}

/**
 * Delete a dashboard
 */
export const salesforceDeleteDashboardTool: ToolConfig<any, any> = {
  id: 'salesforce_delete_dashboard',
  name: 'Delete Dashboard from Salesforce',
  description: 'Delete a specific dashboard',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    dashboardId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Dashboard ID (required)',
    },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/dashboards/${params.dashboardId}`
    },
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },
  transformResponse: async (response, params) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data[0]?.message || data.message || 'Failed to delete dashboard')
    }
    return {
      success: true,
      output: {
        dashboardId: params.dashboardId,
        deleted: true,
        metadata: { operation: 'delete_dashboard' },
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Deletion confirmation' },
  },
}

/**
 * Get dashboard component data
 */
export const salesforceGetDashboardComponentTool: ToolConfig<any, any> = {
  id: 'salesforce_get_dashboard_component',
  name: 'Get Dashboard Component from Salesforce',
  description: 'Get data for a specific component within a dashboard',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    dashboardId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Dashboard ID (required)',
    },
    componentId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Component ID (required)',
    },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/dashboards/${params.dashboardId}/components/${params.componentId}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },
  transformResponse: async (response, params) => {
    const data = await response.json()
    if (!response.ok)
      throw new Error(data[0]?.message || data.message || 'Failed to get dashboard component')
    return {
      success: true,
      output: {
        dashboardId: params.dashboardId,
        componentId: params.componentId,
        componentData: data,
        metadata: { operation: 'get_dashboard_component' },
        success: true,
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Dashboard component data' },
  },
}
