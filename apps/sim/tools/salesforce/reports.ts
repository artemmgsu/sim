import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('SalesforceReports')

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
 * List all available reports
 */
export const salesforceListReportsTool: ToolConfig<any, any> = {
  id: 'salesforce_list_reports',
  name: 'List Reports from Salesforce',
  description: 'Get a list of all available reports in Salesforce',
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
      return `${instanceUrl}/services/data/v59.0/analytics/reports`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },
  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) throw new Error(data[0]?.message || data.message || 'Failed to list reports')
    return {
      success: true,
      output: {
        reports: data,
        metadata: { operation: 'list_reports' },
        success: true,
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'List of reports' },
  },
}

/**
 * Get report metadata
 */
export const salesforceGetReportMetadataTool: ToolConfig<any, any> = {
  id: 'salesforce_get_report_metadata',
  name: 'Get Report Metadata from Salesforce',
  description: 'Get the metadata for a specific report',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    reportId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Report ID (required)',
    },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/reports/${params.reportId}/describe`
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
      throw new Error(data[0]?.message || data.message || 'Failed to get report metadata')
    return {
      success: true,
      output: {
        reportId: params.reportId,
        metadata: data,
        operation: 'get_report_metadata',
        success: true,
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Report metadata' },
  },
}

/**
 * Run a report synchronously
 */
export const salesforceRunReportTool: ToolConfig<any, any> = {
  id: 'salesforce_run_report',
  name: 'Run Report in Salesforce',
  description: 'Execute a report and get its results synchronously',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    reportId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Report ID (required)',
    },
    includeDetails: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Include detailed data (true/false, default: true)',
    },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      const includeDetails = params.includeDetails !== 'false'
      return `${instanceUrl}/services/data/v59.0/analytics/reports/${params.reportId}?includeDetails=${includeDetails}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },
  transformResponse: async (response, params) => {
    const data = await response.json()
    if (!response.ok) throw new Error(data[0]?.message || data.message || 'Failed to run report')
    return {
      success: true,
      output: {
        reportId: params.reportId,
        reportData: data,
        metadata: { operation: 'run_report' },
        success: true,
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Report results' },
  },
}

/**
 * Run a report asynchronously
 */
export const salesforceRunReportAsyncTool: ToolConfig<any, any> = {
  id: 'salesforce_run_report_async',
  name: 'Run Report Asynchronously in Salesforce',
  description: 'Execute a report asynchronously for large data sets',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    reportId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Report ID (required)',
    },
    includeDetails: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Include detailed data (true/false, default: true)',
    },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      const includeDetails = params.includeDetails !== 'false'
      return `${instanceUrl}/services/data/v59.0/analytics/reports/${params.reportId}/instances?includeDetails=${includeDetails}`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: () => ({}),
  },
  transformResponse: async (response, params) => {
    const data = await response.json()
    if (!response.ok)
      throw new Error(data[0]?.message || data.message || 'Failed to run report asynchronously')
    return {
      success: true,
      output: {
        reportId: params.reportId,
        instanceId: data.id,
        status: data.status,
        requestDate: data.requestDate,
        metadata: { operation: 'run_report_async' },
        success: true,
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Async report execution details' },
  },
}

/**
 * Get report instance results
 */
export const salesforceGetReportInstanceTool: ToolConfig<any, any> = {
  id: 'salesforce_get_report_instance',
  name: 'Get Report Instance from Salesforce',
  description: 'Get the results of a specific asynchronous report execution by instance ID',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    reportId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Report ID (required)',
    },
    instanceId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Report instance ID (required)',
    },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/reports/${params.reportId}/instances/${params.instanceId}`
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
      throw new Error(data[0]?.message || data.message || 'Failed to get report instance')
    return {
      success: true,
      output: {
        reportId: params.reportId,
        instanceId: params.instanceId,
        reportData: data,
        metadata: { operation: 'get_report_instance' },
        success: true,
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Report instance results' },
  },
}

/**
 * List report instances
 */
export const salesforceListReportInstancesTool: ToolConfig<any, any> = {
  id: 'salesforce_list_report_instances',
  name: 'List Report Instances from Salesforce',
  description: 'Get a list of all asynchronous execution instances for a specific report',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    reportId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Report ID (required)',
    },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/reports/${params.reportId}/instances`
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
      throw new Error(data[0]?.message || data.message || 'Failed to list report instances')
    return {
      success: true,
      output: {
        reportId: params.reportId,
        instances: data,
        metadata: { operation: 'list_report_instances' },
        success: true,
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'List of report instances' },
  },
}

/**
 * Delete a report instance
 */
export const salesforceDeleteReportInstanceTool: ToolConfig<any, any> = {
  id: 'salesforce_delete_report_instance',
  name: 'Delete Report Instance from Salesforce',
  description: 'Delete a specific report instance',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    reportId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Report ID (required)',
    },
    instanceId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Report instance ID (required)',
    },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/reports/${params.reportId}/instances/${params.instanceId}`
    },
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },
  transformResponse: async (response, params) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data[0]?.message || data.message || 'Failed to delete report instance')
    }
    return {
      success: true,
      output: {
        reportId: params.reportId,
        instanceId: params.instanceId,
        deleted: true,
        metadata: { operation: 'delete_report_instance' },
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Deletion confirmation' },
  },
}

/**
 * Run a report with filters (POST method for custom filtering)
 */
export const salesforceRunReportWithFiltersTool: ToolConfig<any, any> = {
  id: 'salesforce_run_report_with_filters',
  name: 'Run Report with Filters in Salesforce',
  description: 'Execute a report with custom filters and parameters',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    reportId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Report ID (required)',
    },
    reportMetadata: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'JSON string containing report metadata with filters',
    },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/reports/${params.reportId}`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      try {
        return JSON.parse(params.reportMetadata)
      } catch (error) {
        throw new Error('Invalid JSON in reportMetadata parameter')
      }
    },
  },
  transformResponse: async (response, params) => {
    const data = await response.json()
    if (!response.ok)
      throw new Error(data[0]?.message || data.message || 'Failed to run report with filters')
    return {
      success: true,
      output: {
        reportId: params.reportId,
        reportData: data,
        metadata: { operation: 'run_report_with_filters' },
        success: true,
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Filtered report results' },
  },
}

/**
 * Create a new report
 */
export const salesforceCreateReportTool: ToolConfig<any, any> = {
  id: 'salesforce_create_report',
  name: 'Create Report in Salesforce',
  description: 'Create a new report with custom metadata',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    reportMetadata: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description:
        'JSON string containing complete report metadata including name, reportType, etc.',
    },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/reports`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      try {
        const parsed = JSON.parse(params.reportMetadata)
        // Check if user already wrapped it in reportMetadata
        if (parsed.reportMetadata) {
          return parsed
        }
        // Otherwise, wrap it for them
        return { reportMetadata: parsed }
      } catch (error) {
        throw new Error('Invalid JSON in reportMetadata parameter')
      }
    },
  },
  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) throw new Error(data[0]?.message || data.message || 'Failed to create report')
    return {
      success: true,
      output: {
        reportId: data.id,
        report: data,
        created: true,
        metadata: { operation: 'create_report' },
        success: true,
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Created report details' },
  },
}

/**
 * Update an existing report
 */
export const salesforceUpdateReportTool: ToolConfig<any, any> = {
  id: 'salesforce_update_report',
  name: 'Update Report in Salesforce',
  description: 'Update an existing report metadata',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    reportId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Report ID (required)',
    },
    reportMetadata: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'JSON string containing updated report metadata',
    },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/reports/${params.reportId}`
    },
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      try {
        const parsed = JSON.parse(params.reportMetadata)
        if (parsed.reportMetadata) {
          return parsed
        }
        return { reportMetadata: parsed }
      } catch (error) {
        throw new Error('Invalid JSON in reportMetadata parameter')
      }
    },
  },
  transformResponse: async (response, params) => {
    const data = await response.json()
    if (!response.ok) throw new Error(data[0]?.message || data.message || 'Failed to update report')
    return {
      success: true,
      output: {
        reportId: params.reportId,
        report: data,
        updated: true,
        metadata: { operation: 'update_report' },
        success: true,
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Updated report details' },
  },
}

/**
 * Delete a report
 */
export const salesforceDeleteReportTool: ToolConfig<any, any> = {
  id: 'salesforce_delete_report',
  name: 'Delete Report from Salesforce',
  description: 'Delete a specific report permanently',
  version: '1.0.0',
  oauth: { required: true, provider: 'salesforce' },
  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    reportId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Report ID (required)',
    },
  },
  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/reports/${params.reportId}`
    },
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },
  transformResponse: async (response, params) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data[0]?.message || data.message || 'Failed to delete report')
    }
    return {
      success: true,
      output: {
        reportId: params.reportId,
        deleted: true,
        metadata: { operation: 'delete_report' },
      },
    }
  },
  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Deletion confirmation' },
  },
}
