/**
 * CrawlerDashboard.tsx
 * A premium, feature-rich dashboard for triggering autonomous crawls,
 * tracking real-time status, and visualizing sitemaps, states, and defects.
 */
import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Button, MenuItem, 
  LinearProgress, Card, CardContent, Divider, Chip, List, ListItem, 
  ListItemText, Tabs, Tab, CircularProgress, Alert
} from '@mui/material';
import { 
  Play, ShieldAlert, Compass, Map, Layout, Eye, Accessibility
} from 'lucide-react';
import { CrawlOrchestrator } from '../../services/crawler/CrawlOrchestrator';
import type { RouteNode } from '../../services/crawler/RouteGraph';
import type { CrawlReport } from '../../services/crawler/ReportGenerator';
import { useSessionStore } from '../../store/sessionStore';

export function CrawlerDashboard() {
  const { targetUrl: sessionTarget, username: sessionUser, password: sessionPassword } = useSessionStore();
  
  // Crawl configuration states
  const [targetUrl, setTargetUrl] = useState(sessionTarget || 'https://demo.testapp.com');
  const [maxDepth, setMaxDepth] = useState(2);
  const [maxPages, setMaxPages] = useState(10);
  const [username, setUsername] = useState(sessionUser || '');
  const [password, setPassword] = useState(sessionPassword || '');

  // Orchestrator states
  const [crawlStatus, setCrawlStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [stepName, setStepName] = useState('');
  const [stepDesc, setStepDesc] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [nodes, setNodes] = useState<RouteNode[]>([]);
  const [report, setReport] = useState<CrawlReport | null>(null);

  // Tab state for report results
  const [resultTab, setResultTab] = useState(0);
  
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Sync inputs with session store when they change
  useEffect(() => {
    if (sessionTarget) setTargetUrl(sessionTarget);
    if (sessionUser) setUsername(sessionUser);
    if (sessionPassword) setPassword(sessionPassword);
  }, [sessionTarget, sessionUser, sessionPassword]);

  const handleStartCrawl = async () => {
    setCrawlStatus('running');
    setLogs([]);
    setNodes([]);
    setReport(null);
    setCurrentStep(1);
    
    const orchestrator = new CrawlOrchestrator();
    
    try {
      const crawlReport = await orchestrator.startCrawl(targetUrl, {
        maxDepth,
        maxPages,
        credentials: username ? { username, password } : undefined,
        onStepProgress: (step, name, description) => {
          setCurrentStep(step);
          setStepName(name);
          setStepDesc(description);
        },
        onLog: (msg) => {
          setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} → ${msg}`]);
        },
        onSitemapUpdated: (sitemapNodes) => {
          setNodes(sitemapNodes);
        }
      });
      
      setReport(crawlReport);
      setCrawlStatus('completed');
    } catch (err) {
      console.error(err);
      setLogs(prev => [...prev, `[ERROR] Crawl failed: ${err instanceof Error ? err.message : String(err)}`]);
      setCrawlStatus('failed');
    }
  };

  const getStepPercentage = () => {
    if (crawlStatus === 'completed') return 100;
    return Math.round((currentStep / 8) * 100);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 3, overflow: 'hidden' }}>
      {/* Settings Row */}
      <Paper sx={{ p: 2.5, borderRadius: 3, flexShrink: 0, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
        <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Compass size={18} color="#6366f1" /> Autonomous Crawler Settings
        </Typography>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Target Website URL"
              variant="outlined"
              size="small"
              fullWidth
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              disabled={crawlStatus === 'running'}
              placeholder="https://example.com"
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <TextField
              select
              label="Max Crawl Depth"
              size="small"
              fullWidth
              value={maxDepth}
              onChange={(e) => setMaxDepth(Number(e.target.value))}
              disabled={crawlStatus === 'running'}
            >
              <MenuItem value={1}>1 (Landing Only)</MenuItem>
              <MenuItem value={2}>2 (Standard Site)</MenuItem>
              <MenuItem value={3}>3 (Deep Scan)</MenuItem>
              <MenuItem value={4}>4 (Complex Site)</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <TextField
              select
              label="Max Pages Limit"
              size="small"
              fullWidth
              value={maxPages}
              onChange={(e) => setMaxPages(Number(e.target.value))}
              disabled={crawlStatus === 'running'}
            >
              <MenuItem value={5}>5 Pages</MenuItem>
              <MenuItem value={10}>10 Pages</MenuItem>
              <MenuItem value={15}>15 Pages</MenuItem>
              <MenuItem value={25}>25 Pages</MenuItem>
              <MenuItem value={50}>50 Pages</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Auth Username (Optional)"
              variant="outlined"
              size="small"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={crawlStatus === 'running'}
              fullWidth
            />
            <TextField
              label="Auth Password (Optional)"
              type="password"
              variant="outlined"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={crawlStatus === 'running'}
              fullWidth
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={crawlStatus === 'running' ? <CircularProgress size={18} color="inherit" /> : <Play size={18} />}
            disabled={crawlStatus === 'running' || !targetUrl}
            onClick={handleStartCrawl}
            sx={{ px: 3, py: 1, borderRadius: 2 }}
          >
            {crawlStatus === 'running' ? 'Crawling...' : 'Execute Crawl'}
          </Button>
        </Box>
      </Paper>

      {/* Main Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', minHeight: 0, gap: 3 }}>
        {/* Left Column: Progress or Summary */}
        <Box sx={{ width: crawlStatus === 'completed' ? '100%' : '100%', display: 'flex', flexDirection: 'column', gap: 3, minHeight: 0, flexGrow: 1 }}>
          {/* Running State View */}
          {crawlStatus === 'running' && (
            <Grid container spacing={3} sx={{ height: '100%', minHeight: 0 }}>
              <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5, borderRadius: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    Crawl Progress
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={getStepPercentage()} 
                        sx={{ height: 10, borderRadius: 5, background: '#f1f5f9', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #6366f1, #ec4899)' } }} 
                      />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {getStepPercentage()}%
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.1)', p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                      Step {currentStep}/8: {stepName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stepDesc}
                    </Typography>
                  </Box>

                  {/* BFS sitemap discovery queue visualizer */}
                  <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Discovered Paths ({nodes.length})</Typography>
                    <List dense disablePadding>
                      {nodes.map((node) => (
                        <ListItem key={node.id} disablePadding sx={{ py: 0.5, borderBottom: '1px solid #f1f5f9' }}>
                          <ListItemText 
                            primary={<Typography sx={{ fontSize: '13px', fontFamily: 'monospace', color: '#334155' }}>{node.url}</Typography>}
                            secondary={<Typography variant="caption" sx={{ fontSize: '11px', color: 'text.secondary' }}>{node.parent ? `via ${node.parent}` : 'Root page'}</Typography>}
                          />
                          <Chip size="small" label="mapped" color="success" variant="outlined" sx={{ height: 18, fontSize: '9px' }} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Paper>
              </Grid>

              {/* Logs visualizer */}
              <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Paper sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontSize: '1.2rem', fontWeight: 700 }}>
                    Live Crawl Logs
                  </Typography>
                  <Box 
                    sx={{ 
                      flexGrow: 1,
                      bgcolor: '#0f172a', 
                      p: 2,
                      borderRadius: 3,
                      overflowY: 'auto',
                      border: '1px solid #1e293b',
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
                      fontFamily: '"Fira Code", monospace, "Courier New"',
                      fontSize: '12px'
                    }}
                  >
                    {logs.map((log, idx) => (
                      <Box key={idx} sx={{ color: log.includes('[ERROR]') ? '#ef4444' : log.includes('Warning') ? '#f59e0b' : '#38bdf8', mb: 0.8, wordBreak: 'break-all', lineHeight: 1.4 }}>
                        {log}
                      </Box>
                    ))}
                    <div ref={logEndRef} />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Idle Welcome State */}
          {crawlStatus === 'idle' && (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px solid rgba(15, 23, 42, 0.08)', my: 'auto', maxWidth: 600, mx: 'auto' }}>
              <Compass size={64} color="#6366f1" style={{ marginBottom: 16 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>Ready to Explore autonomously</Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
                Enter your target website domain and click <strong>Execute Crawl</strong>. 
                The AI UI Tester will dynamically navigate the site, locate pages and components, 
                run Axe accessibility checks, generate multi-resolution snapshots, 
                and construct visual regressions summaries along with AI defect classifications.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
                <Chip icon={<Map size={14} />} label="BFS Site Discovery" variant="outlined" />
                <Chip icon={<Layout size={14} />} label="Dynamic State Mapping" />
                <Chip icon={<Accessibility size={14} />} label="Axe Accessibility" variant="outlined" />
                <Chip icon={<Eye size={14} />} label="Multi-Viewport Regressions" />
              </Box>
            </Paper>
          )}

          {/* Failed State */}
          {crawlStatus === 'failed' && (
            <Box sx={{ p: 4, textAlign: 'center', my: 'auto', maxWidth: 600, mx: 'auto' }}>
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                Crawl Orchestrator failed during execution. Please review the logs to troubleshoot potential network or permission bugs.
              </Alert>
              <Button variant="outlined" onClick={() => setCrawlStatus('idle')}>Reset Dashboard</Button>
            </Box>
          )}

          {/* Completed State Results View */}
          {crawlStatus === 'completed' && report && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%', minHeight: 0 }}>
              {/* Summary Cards */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flexShrink: 0 }}>
                <Card sx={{ flex: '1 1 180px', borderRadius: 3, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.02))', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>Pages Mapped</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#6366f1' }}>{report.crawlSummary.pagesCrawled}</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: '1 1 180px', borderRadius: 3, background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(236, 72, 153, 0.02))', border: '1px solid rgba(236, 72, 153, 0.15)' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>UI States Found</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#ec4899' }}>{report.crawlSummary.statesExplored}</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: '1 1 180px', borderRadius: 3, background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.02))', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>Accessibility Issues</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#f59e0b' }}>{report.accessibility.length}</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: '1 1 180px', borderRadius: 3, background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.02))', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>Visual Shifts</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#ef4444' }}>{report.visualIssues.length}</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: '1 1 180px', borderRadius: 3, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.02))', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>Classified Defects</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981' }}>{report.defects.length}</Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* Toggle Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
                <Tabs value={resultTab} onChange={(_, nv) => setResultTab(nv)}>
                  <Tab icon={<Map size={16} />} iconPosition="start" label="Sitemap Graph" />
                  <Tab icon={<Layout size={16} />} iconPosition="start" label="Discovered States" />
                  <Tab icon={<Accessibility size={16} />} iconPosition="start" label="Accessibility Reports" />
                  <Tab icon={<Eye size={16} />} iconPosition="start" label="Visual Regression" />
                  <Tab icon={<ShieldAlert size={16} />} iconPosition="start" label="AI Defect Classifier" />
                </Tabs>
              </Box>

              {/* Tab Panels */}
              <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
                {/* 1. Sitemap Tree Panel */}
                {resultTab === 0 && (
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Interactive Sitemap Route Map</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {nodes.map((node) => (
                        <Box 
                          key={node.id} 
                          sx={{ 
                            p: 2, 
                            borderRadius: 2.5, 
                            border: '1px solid rgba(15, 23, 42, 0.08)',
                            bgcolor: node.parent ? 'white' : 'rgba(99, 102, 241, 0.03)',
                            ml: node.parent ? 4 : 0,
                            position: 'relative',
                            '&::before': node.parent ? {
                              content: '""',
                              position: 'absolute',
                              left: -20,
                              top: '50%',
                              width: 20,
                              height: 1,
                              borderTop: '2px dashed rgba(99, 102, 241, 0.25)'
                            } : {}
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                            {node.id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            URL: {node.url}
                          </Typography>
                          {node.children.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                              {node.children.map(child => (
                                <Chip key={child} size="small" label={child} variant="outlined" sx={{ height: 20, fontSize: '10px' }} />
                              ))}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                )}

                {/* 2. Discovered States Panel */}
                {resultTab === 1 && (
                  <Grid container spacing={3}>
                    {report.states.map((state) => (
                      <Grid size={{ xs: 12, md: 6 }} key={state.id}>
                        <Card sx={{ borderRadius: 3, height: '100%', border: '1px solid rgba(15, 23, 42, 0.08)' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{state.name}</Typography>
                              <Chip 
                                label={state.type.toUpperCase()} 
                                size="small" 
                                color={state.type === 'default' ? 'primary' : 'secondary'} 
                                sx={{ height: 20, fontSize: '10px', fontWeight: 'bold' }} 
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontFamily: 'monospace' }}>
                              URL: {state.pageUrl}
                            </Typography>
                            {state.triggerSelector && (
                              <Box sx={{ p: 1, px: 1.5, mb: 2, borderRadius: 1.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Trigger Element Selector:</Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#dc2626' }}>{state.triggerSelector}</Typography>
                              </Box>
                            )}
                            <Divider sx={{ mb: 1.5 }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>Interactive Elements Bound:</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {state.elements.map((el, i) => (
                                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 0.8, borderRadius: 1, bgcolor: '#f8fafc' }}>
                                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all', mr: 2 }}>
                                    {el.selector}
                                  </Typography>
                                  <Chip label={`${el.type}`} size="small" sx={{ height: 16, fontSize: '9px' }} />
                                </Box>
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* 3. Accessibility Audits Panel */}
                {resultTab === 2 && (
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Axe Core Accessibility Violations</Typography>
                    {report.accessibility.length === 0 ? (
                      <Alert severity="success" sx={{ borderRadius: 2 }}>No accessibility violations detected. Complies with WCAG rules.</Alert>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {report.accessibility.map((issue, idx) => (
                          <Box key={idx} sx={{ p: 2, borderRadius: 2.5, border: '1px solid rgba(15, 23, 42, 0.08)', position: 'relative' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#e21d48' }}>
                                {issue.id}
                              </Typography>
                              <Chip 
                                label={issue.severity.toUpperCase()} 
                                size="small" 
                                color={issue.severity === 'critical' ? 'error' : issue.severity === 'serious' ? 'warning' : 'default'} 
                                sx={{ height: 20, fontSize: '10px', fontWeight: 'bold' }} 
                              />
                            </Box>
                            <Typography variant="body2" sx={{ mb: 1.5, color: '#334155' }}>
                              {issue.description}
                            </Typography>
                            <Box sx={{ p: 1, px: 1.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 1.5, mb: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Element Locator Selector:</Typography>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '12px' }}>{issue.element}</Typography>
                            </Box>
                            {issue.helpUrl && (
                              <Typography variant="caption">
                                <a href={issue.helpUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
                                  Deque University Help Guidelines →
                                </a>
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Paper>
                )}

                {/* 4. Visual Regressions Panel */}
                {resultTab === 3 && (
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Multi-Viewport Screenshot Comparison</Typography>
                    {report.visualIssues.length === 0 ? (
                      <Alert severity="success" sx={{ borderRadius: 2 }}>No layout anomalies detected against visual baselines.</Alert>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {report.visualIssues.map((issue) => (
                          <Box key={issue.id} sx={{ p: 2, borderRadius: 2.5, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                  {issue.issueType.replace('_', ' ').toUpperCase()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Page: {issue.pageUrl} | Viewport: <strong>{issue.viewport}</strong>
                                </Typography>
                              </Box>
                              <Chip 
                                label={`Diff: ${issue.differencePercentage}%`} 
                                color="error" 
                                variant="outlined" 
                                size="small" 
                                sx={{ fontWeight: 'bold' }} 
                              />
                            </Box>
                            
                            <Typography variant="body2" sx={{ mb: 2, color: '#334155' }}>
                              {issue.description}
                            </Typography>

                            {/* Render visual diff carousel if base64 images exist */}
                            {issue.baselineUrl && (
                              <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', bgcolor: '#f8fafc' }}>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>Baseline</Typography>
                                    <img src={issue.baselineUrl} alt="Baseline" style={{ maxWidth: '100%', height: 120, objectFit: 'contain' }} />
                                  </Paper>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', bgcolor: '#f8fafc' }}>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>Current</Typography>
                                    <img src={issue.currentUrl} alt="Current" style={{ maxWidth: '100%', height: 120, objectFit: 'contain' }} />
                                  </Paper>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', bgcolor: '#f8fafc' }}>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 'bold', color: '#ef4444' }}>Diff Overlay</Typography>
                                    <img src={issue.diffUrl} alt="Diff Highlight" style={{ maxWidth: '100%', height: 120, objectFit: 'contain' }} />
                                  </Paper>
                                </Grid>
                              </Grid>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Paper>
                )}

                {/* 5. AI Defect Classifier Panel */}
                {resultTab === 4 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {report.defects.map((defect) => (
                      <Paper 
                        key={defect.id} 
                        sx={{ 
                          p: 3, 
                          borderRadius: 3.5, 
                          border: '1px solid rgba(15, 23, 42, 0.08)',
                          background: 'linear-gradient(to right, rgba(99, 102, 241, 0.02), white)',
                          position: 'relative'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Chip 
                              label={defect.type.toUpperCase()} 
                              size="small" 
                              sx={{ bgcolor: 'rgba(99,102,241,0.1)', color: '#6366f1', fontWeight: 'bold', mb: 0.8, fontSize: '10px' }} 
                            />
                            <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>
                              {defect.issue}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              Detected on URL: <strong>{defect.pageUrl}</strong>
                            </Typography>
                          </Box>
                          <Chip 
                            label={defect.severity.toUpperCase()} 
                            color={defect.severity === 'Critical' ? 'error' : defect.severity === 'High' ? 'warning' : 'default'} 
                            sx={{ fontWeight: 'bold' }} 
                          />
                        </Box>

                        <Grid container spacing={3} sx={{ mt: 0.5 }}>
                          {defect.rootCause && (
                            <Grid size={{ xs: 12, md: 4 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>Root Cause Analysis</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px', lineHeight: 1.5 }}>
                                {defect.rootCause}
                              </Typography>
                            </Grid>
                          )}
                          {defect.reproductionSteps && (
                            <Grid size={{ xs: 12, md: 4 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>Steps to Reproduce</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                                {defect.reproductionSteps}
                              </Typography>
                            </Grid>
                          )}
                          {defect.fixSuggestion && (
                            <Grid size={{ xs: 12, md: 4 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#10b981', mb: 0.5 }}>Suggested Fix</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px', lineHeight: 1.5 }}>
                                {defect.fixSuggestion}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
