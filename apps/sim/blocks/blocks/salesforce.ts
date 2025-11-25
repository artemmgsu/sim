import { SalesforceIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { SalesforceResponse } from '@/tools/salesforce/types'

export const SalesforceBlock: BlockConfig<SalesforceResponse> = {
  type: 'salesforce',
  name: 'Salesforce',
  description: 'Interact with Salesforce CRM',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Salesforce into your workflow. Manage accounts, contacts, leads, opportunities, cases, tasks, reports, and dashboards with powerful automation capabilities.',
  docsLink: 'https://docs.sim.ai/tools/salesforce',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: SalesforceIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Get Accounts', id: 'get_accounts' },
        { label: 'Create Account', id: 'create_account' },
        { label: 'Update Account', id: 'update_account' },
        { label: 'Delete Account', id: 'delete_account' },
        { label: 'Get Contacts', id: 'get_contacts' },
        { label: 'Create Contact', id: 'create_contact' },
        { label: 'Update Contact', id: 'update_contact' },
        { label: 'Delete Contact', id: 'delete_contact' },
        { label: 'Get Leads', id: 'get_leads' },
        { label: 'Create Lead', id: 'create_lead' },
        { label: 'Update Lead', id: 'update_lead' },
        { label: 'Delete Lead', id: 'delete_lead' },
        { label: 'Get Opportunities', id: 'get_opportunities' },
        { label: 'Create Opportunity', id: 'create_opportunity' },
        { label: 'Update Opportunity', id: 'update_opportunity' },
        { label: 'Delete Opportunity', id: 'delete_opportunity' },
        { label: 'Get Cases', id: 'get_cases' },
        { label: 'Create Case', id: 'create_case' },
        { label: 'Update Case', id: 'update_case' },
        { label: 'Delete Case', id: 'delete_case' },
        { label: 'Get Tasks', id: 'get_tasks' },
        { label: 'Create Task', id: 'create_task' },
        { label: 'Update Task', id: 'update_task' },
        { label: 'Delete Task', id: 'delete_task' },
        { label: 'List Reports', id: 'list_reports' },
        { label: 'Get Report Metadata', id: 'get_report_metadata' },
        { label: 'Run Report', id: 'run_report' },
        { label: 'Run Report Async', id: 'run_report_async' },
        { label: 'Get Report Instance', id: 'get_report_instance' },
        { label: 'List Report Instances', id: 'list_report_instances' },
        { label: 'Delete Report Instance', id: 'delete_report_instance' },
        { label: 'Run Report with Filters', id: 'run_report_with_filters' },
        { label: 'Create Report', id: 'create_report' },
        { label: 'Update Report', id: 'update_report' },
        { label: 'Delete Report', id: 'delete_report' },
        { label: 'List Dashboards', id: 'list_dashboards' },
        { label: 'Get Dashboard', id: 'get_dashboard' },
        { label: 'Refresh Dashboard', id: 'refresh_dashboard' },
        { label: 'Clone Dashboard', id: 'clone_dashboard' },
        { label: 'Delete Dashboard', id: 'delete_dashboard' },
        { label: 'Get Dashboard Component', id: 'get_dashboard_component' },
      ],
      value: () => 'get_accounts',
    },
    {
      id: 'credential',
      title: 'Salesforce Account',
      type: 'oauth-input',
      provider: 'salesforce',
      serviceId: 'salesforce',
      requiredScopes: ['api', 'refresh_token', 'openid'],
      placeholder: 'Select Salesforce account',
      required: true,
    },
    // Common fields for GET operations
    {
      id: 'fields',
      title: 'Fields to Return',
      type: 'short-input',
      placeholder: 'Comma-separated fields',
      condition: {
        field: 'operation',
        value: [
          'get_accounts',
          'get_contacts',
          'get_leads',
          'get_opportunities',
          'get_cases',
          'get_tasks',
        ],
      },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: 'Max results (default: 100)',
      condition: {
        field: 'operation',
        value: [
          'get_accounts',
          'get_contacts',
          'get_leads',
          'get_opportunities',
          'get_cases',
          'get_tasks',
        ],
      },
    },
    {
      id: 'orderBy',
      title: 'Order By',
      type: 'short-input',
      placeholder: 'Field and direction (e.g., "Name ASC")',
      condition: {
        field: 'operation',
        value: [
          'get_accounts',
          'get_contacts',
          'get_leads',
          'get_opportunities',
          'get_cases',
          'get_tasks',
        ],
      },
    },
    // Account fields
    {
      id: 'accountId',
      title: 'Account ID',
      type: 'short-input',
      placeholder: 'Salesforce Account ID',
      condition: {
        field: 'operation',
        value: [
          'update_account',
          'delete_account',
          'create_contact',
          'update_contact',
          'create_case',
        ],
      },
    },
    {
      id: 'name',
      title: 'Name',
      type: 'short-input',
      placeholder: 'Name',
      condition: {
        field: 'operation',
        value: [
          'create_account',
          'update_account',
          'create_opportunity',
          'update_opportunity',
          'clone_dashboard',
        ],
      },
    },
    {
      id: 'type',
      title: 'Type',
      type: 'short-input',
      placeholder: 'Type',
      condition: { field: 'operation', value: ['create_account', 'update_account'] },
    },
    {
      id: 'industry',
      title: 'Industry',
      type: 'short-input',
      placeholder: 'Industry',
      condition: { field: 'operation', value: ['create_account', 'update_account'] },
    },
    {
      id: 'phone',
      title: 'Phone',
      type: 'short-input',
      placeholder: 'Phone',
      condition: {
        field: 'operation',
        value: [
          'create_account',
          'update_account',
          'create_contact',
          'update_contact',
          'create_lead',
          'update_lead',
        ],
      },
    },
    {
      id: 'website',
      title: 'Website',
      type: 'short-input',
      placeholder: 'Website',
      condition: { field: 'operation', value: ['create_account', 'update_account'] },
    },
    // Contact fields
    {
      id: 'contactId',
      title: 'Contact ID',
      type: 'short-input',
      placeholder: 'Contact ID',
      condition: {
        field: 'operation',
        value: ['get_contacts', 'update_contact', 'delete_contact', 'create_case'],
      },
    },
    {
      id: 'lastName',
      title: 'Last Name',
      type: 'short-input',
      placeholder: 'Last name',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact', 'create_lead', 'update_lead'],
      },
    },
    {
      id: 'firstName',
      title: 'First Name',
      type: 'short-input',
      placeholder: 'First name',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact', 'create_lead', 'update_lead'],
      },
    },
    {
      id: 'email',
      title: 'Email',
      type: 'short-input',
      placeholder: 'Email',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact', 'create_lead', 'update_lead'],
      },
    },
    {
      id: 'title',
      title: 'Job Title',
      type: 'short-input',
      placeholder: 'Job title',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact', 'create_lead', 'update_lead'],
      },
    },
    // Lead fields
    {
      id: 'leadId',
      title: 'Lead ID',
      type: 'short-input',
      placeholder: 'Lead ID',
      condition: { field: 'operation', value: ['get_leads', 'update_lead', 'delete_lead'] },
    },
    {
      id: 'company',
      title: 'Company',
      type: 'short-input',
      placeholder: 'Company name',
      condition: { field: 'operation', value: ['create_lead', 'update_lead'] },
    },
    {
      id: 'status',
      title: 'Status',
      type: 'short-input',
      placeholder: 'Status',
      condition: {
        field: 'operation',
        value: [
          'create_lead',
          'update_lead',
          'create_case',
          'update_case',
          'create_task',
          'update_task',
        ],
      },
    },
    {
      id: 'leadSource',
      title: 'Lead Source',
      type: 'short-input',
      placeholder: 'Lead source',
      condition: { field: 'operation', value: ['create_lead', 'update_lead'] },
    },
    // Opportunity fields
    {
      id: 'opportunityId',
      title: 'Opportunity ID',
      type: 'short-input',
      placeholder: 'Opportunity ID',
      condition: {
        field: 'operation',
        value: ['get_opportunities', 'update_opportunity', 'delete_opportunity'],
      },
    },
    {
      id: 'stageName',
      title: 'Stage Name',
      type: 'short-input',
      placeholder: 'Stage name',
      condition: { field: 'operation', value: ['create_opportunity', 'update_opportunity'] },
    },
    {
      id: 'closeDate',
      title: 'Close Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD (required for create)',
      condition: { field: 'operation', value: ['create_opportunity', 'update_opportunity'] },
      required: true,
    },
    {
      id: 'amount',
      title: 'Amount',
      type: 'short-input',
      placeholder: 'Deal amount',
      condition: { field: 'operation', value: ['create_opportunity', 'update_opportunity'] },
    },
    {
      id: 'probability',
      title: 'Probability',
      type: 'short-input',
      placeholder: 'Win probability (0-100)',
      condition: { field: 'operation', value: ['create_opportunity', 'update_opportunity'] },
    },
    // Case fields
    {
      id: 'caseId',
      title: 'Case ID',
      type: 'short-input',
      placeholder: 'Case ID',
      condition: { field: 'operation', value: ['get_cases', 'update_case', 'delete_case'] },
    },
    {
      id: 'subject',
      title: 'Subject',
      type: 'short-input',
      placeholder: 'Subject',
      condition: {
        field: 'operation',
        value: ['create_case', 'update_case', 'create_task', 'update_task'],
      },
    },
    {
      id: 'priority',
      title: 'Priority',
      type: 'short-input',
      placeholder: 'Priority',
      condition: {
        field: 'operation',
        value: ['create_case', 'update_case', 'create_task', 'update_task'],
      },
    },
    {
      id: 'origin',
      title: 'Origin',
      type: 'short-input',
      placeholder: 'Origin (e.g., Phone, Email, Web)',
      condition: { field: 'operation', value: ['create_case'] },
    },
    // Task fields
    {
      id: 'taskId',
      title: 'Task ID',
      type: 'short-input',
      placeholder: 'Task ID',
      condition: { field: 'operation', value: ['get_tasks', 'update_task', 'delete_task'] },
    },
    {
      id: 'activityDate',
      title: 'Due Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD',
      condition: { field: 'operation', value: ['create_task', 'update_task'] },
    },
    {
      id: 'whoId',
      title: 'Related Contact/Lead ID',
      type: 'short-input',
      placeholder: 'Contact or Lead ID',
      condition: { field: 'operation', value: ['create_task'] },
    },
    {
      id: 'whatId',
      title: 'Related Account/Opportunity ID',
      type: 'short-input',
      placeholder: 'Account or Opportunity ID',
      condition: { field: 'operation', value: ['create_task'] },
    },
    // Report fields
    {
      id: 'reportId',
      title: 'Report ID',
      type: 'short-input',
      placeholder: 'Salesforce Report ID (e.g., 00Og5000000rk0nEAA)',
      required: true,
      condition: {
        field: 'operation',
        value: [
          'get_report_metadata',
          'run_report',
          'run_report_async',
          'get_report_instance',
          'list_report_instances',
          'delete_report_instance',
          'run_report_with_filters',
          'update_report',
          'delete_report',
        ],
      },
    },
    {
      id: 'instanceId',
      title: 'Report Instance ID',
      type: 'short-input',
      placeholder: 'Instance ID from async report execution',
      required: true,
      condition: {
        field: 'operation',
        value: ['get_report_instance', 'delete_report_instance'],
      },
    },
    {
      id: 'includeDetails',
      title: 'Include Details',
      type: 'short-input',
      placeholder: 'true or false (default: true)',
      condition: {
        field: 'operation',
        value: ['run_report', 'run_report_async'],
      },
    },
    // Dashboard fields
    {
      id: 'dashboardId',
      title: 'Dashboard ID',
      type: 'short-input',
      placeholder: 'Salesforce Dashboard ID',
      required: true,
      condition: {
        field: 'operation',
        value: [
          'get_dashboard',
          'refresh_dashboard',
          'clone_dashboard',
          'delete_dashboard',
          'get_dashboard_component',
        ],
      },
    },
    {
      id: 'componentId',
      title: 'Component ID',
      type: 'short-input',
      placeholder: 'Dashboard Component ID',
      required: true,
      condition: {
        field: 'operation',
        value: ['get_dashboard_component'],
      },
    },
    {
      id: 'folderId',
      title: 'Folder ID',
      type: 'short-input',
      placeholder: 'Destination Folder ID',
      condition: {
        field: 'operation',
        value: ['clone_dashboard'],
      },
    },
    // Long-input fields at the bottom
    {
      id: 'description',
      title: 'Description',
      type: 'long-input',
      placeholder: 'Description',
      condition: {
        field: 'operation',
        value: [
          'create_account',
          'update_account',
          'create_contact',
          'update_contact',
          'create_lead',
          'update_lead',
          'create_opportunity',
          'update_opportunity',
          'create_case',
          'update_case',
          'create_task',
          'update_task',
        ],
      },
    },
    {
      id: 'reportMetadata',
      title: 'Report Metadata (JSON)',
      type: 'long-input',
      placeholder: 'JSON string containing report metadata with filters',
      required: true,
      condition: {
        field: 'operation',
        value: ['run_report_with_filters', 'create_report', 'update_report'],
      },
    },
  ],
  tools: {
    access: [
      'salesforce_get_accounts',
      'salesforce_create_account',
      'salesforce_update_account',
      'salesforce_delete_account',
      'salesforce_get_contacts',
      'salesforce_create_contact',
      'salesforce_update_contact',
      'salesforce_delete_contact',
      'salesforce_get_leads',
      'salesforce_create_lead',
      'salesforce_update_lead',
      'salesforce_delete_lead',
      'salesforce_get_opportunities',
      'salesforce_create_opportunity',
      'salesforce_update_opportunity',
      'salesforce_delete_opportunity',
      'salesforce_get_cases',
      'salesforce_create_case',
      'salesforce_update_case',
      'salesforce_delete_case',
      'salesforce_get_tasks',
      'salesforce_create_task',
      'salesforce_update_task',
      'salesforce_delete_task',
      'salesforce_list_reports',
      'salesforce_get_report_metadata',
      'salesforce_run_report',
      'salesforce_run_report_async',
      'salesforce_get_report_instance',
      'salesforce_list_report_instances',
      'salesforce_delete_report_instance',
      'salesforce_run_report_with_filters',
      'salesforce_create_report',
      'salesforce_update_report',
      'salesforce_delete_report',
      'salesforce_list_dashboards',
      'salesforce_get_dashboard',
      'salesforce_refresh_dashboard',
      'salesforce_clone_dashboard',
      'salesforce_delete_dashboard',
      'salesforce_get_dashboard_component',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'get_accounts':
            return 'salesforce_get_accounts'
          case 'create_account':
            return 'salesforce_create_account'
          case 'update_account':
            return 'salesforce_update_account'
          case 'delete_account':
            return 'salesforce_delete_account'
          case 'get_contacts':
            return 'salesforce_get_contacts'
          case 'create_contact':
            return 'salesforce_create_contact'
          case 'update_contact':
            return 'salesforce_update_contact'
          case 'delete_contact':
            return 'salesforce_delete_contact'
          case 'get_leads':
            return 'salesforce_get_leads'
          case 'create_lead':
            return 'salesforce_create_lead'
          case 'update_lead':
            return 'salesforce_update_lead'
          case 'delete_lead':
            return 'salesforce_delete_lead'
          case 'get_opportunities':
            return 'salesforce_get_opportunities'
          case 'create_opportunity':
            return 'salesforce_create_opportunity'
          case 'update_opportunity':
            return 'salesforce_update_opportunity'
          case 'delete_opportunity':
            return 'salesforce_delete_opportunity'
          case 'get_cases':
            return 'salesforce_get_cases'
          case 'create_case':
            return 'salesforce_create_case'
          case 'update_case':
            return 'salesforce_update_case'
          case 'delete_case':
            return 'salesforce_delete_case'
          case 'get_tasks':
            return 'salesforce_get_tasks'
          case 'create_task':
            return 'salesforce_create_task'
          case 'update_task':
            return 'salesforce_update_task'
          case 'delete_task':
            return 'salesforce_delete_task'
          case 'list_reports':
            return 'salesforce_list_reports'
          case 'get_report_metadata':
            return 'salesforce_get_report_metadata'
          case 'run_report':
            return 'salesforce_run_report'
          case 'run_report_async':
            return 'salesforce_run_report_async'
          case 'get_report_instance':
            return 'salesforce_get_report_instance'
          case 'list_report_instances':
            return 'salesforce_list_report_instances'
          case 'delete_report_instance':
            return 'salesforce_delete_report_instance'
          case 'run_report_with_filters':
            return 'salesforce_run_report_with_filters'
          case 'create_report':
            return 'salesforce_create_report'
          case 'update_report':
            return 'salesforce_update_report'
          case 'delete_report':
            return 'salesforce_delete_report'
          case 'list_dashboards':
            return 'salesforce_list_dashboards'
          case 'get_dashboard':
            return 'salesforce_get_dashboard'
          case 'refresh_dashboard':
            return 'salesforce_refresh_dashboard'
          case 'clone_dashboard':
            return 'salesforce_clone_dashboard'
          case 'delete_dashboard':
            return 'salesforce_delete_dashboard'
          case 'get_dashboard_component':
            return 'salesforce_get_dashboard_component'
          default:
            throw new Error(`Unknown operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const { credential, operation, ...rest } = params
        const cleanParams: Record<string, any> = { credential }
        Object.entries(rest).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            cleanParams[key] = value
          }
        })
        return cleanParams
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Salesforce credential' },
  },
  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: { type: 'json', description: 'Operation result data' },
  },
}
