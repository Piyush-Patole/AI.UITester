import type { ColDef } from 'ag-grid-community';
import { StatusBadge } from '../components/results/StatusBadge';
import { SeverityBadge } from '../components/results/SeverityBadge';
import { ConfidenceBar } from '../components/results/ConfidenceBar';
import { SelfHealSuggestion } from '../components/results/SelfHealSuggestion';

export function buildResultColumns(): ColDef[] {
  return [
    {
      field: 'test_id',
      headerName: 'ID',
      width: 100,
      pinned: 'left',
      sortable: true,
    },
    {
      field: 'test_name',
      headerName: 'Test Name',
      flex: 2,
      editable: true,
      filter: true,
      wrapText: true,
    },
    {
      field: 'test_type',
      headerName: 'Type',
      width: 130,
      filter: true,
    },
    { field: 'browser', headerName: 'Browser', width: 120, filter: true },
    {
      field: 'estimated_status',
      headerName: 'Status',
      width: 120,
      cellRenderer: StatusBadge,
      filter: true,
    },
    {
      field: 'severity',
      headerName: 'Severity',
      width: 120,
      cellRenderer: SeverityBadge,
    },
    { field: 'rca.issue_title',   headerName: 'Issue',            flex: 2, editable: true, wrapText: true },
    { field: 'rca.rca',           headerName: 'RCA',              flex: 3, editable: true, wrapText: true },
    { field: 'rca.reason',        headerName: 'Reason',           flex: 2, editable: true },
    { field: 'rca.fix_suggestion',headerName: 'Recommended Fix',  flex: 2, editable: true },
    { field: 'rca.failure_category', headerName: 'Category',      width: 140 },
    { field: 'rca.is_app_bug',    headerName: 'App Bug?',         width: 110,
      valueFormatter: (p: any) => p.value ? 'Yes' : 'No' },
    {
      field: 'confidence_score',
      headerName: 'Confidence',
      width: 150,
      cellRenderer: ConfidenceBar,
    },
    { field: 'flakiness.classification',  headerName: 'Flakiness',       width: 120 },
    { field: 'flakiness.flakiness_score', headerName: 'Flakiness Score', width: 140,
      valueFormatter: (p: any) => p.value != null ? `${Math.round(p.value * 100)}%` : '' },
    {
      field: 'self_heal.suggested_locator',
      headerName: 'Healed Locator',
      flex: 2,
      cellRenderer: SelfHealSuggestion,
    },
    {
      field: 'steps',
      headerName: 'Steps',
      width: 100,
      valueGetter: (p: any) => p.data?.steps?.length ?? 0,
    },
    { field: 'notes', headerName: 'Notes', flex: 2, editable: true },
  ];
}
