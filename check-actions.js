const { execSync } = require('child_process');

async function checkActions() {
  try {
    const remoteUrl = execSync('git config --get remote.origin.url').toString();
    const tokenMatch = remoteUrl.match(/https:\/\/(.*)@/);
    if (!tokenMatch) return;
    const token = tokenMatch[1];
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'Node Script'
    };

    const response = await fetch('https://api.github.com/repos/casp3rgr33n/nadirtools/actions/runs?per_page=1', { headers });
    const data = await response.json();
    const run = data.workflow_runs[0];
    
    console.log(`Run: ${run.name} - ${run.conclusion}`);
    
    const jobsResponse = await fetch(run.jobs_url, { headers });
    const jobsData = await jobsResponse.json();
    
    const failedJob = jobsData.jobs.find(j => j.conclusion === 'failure');
    if (failedJob) {
      const failedStep = failedJob.steps.find(s => s.conclusion === 'failure');
      console.log('Failed Step:', failedStep.name);
      
      // Attempt to get logs for the job
      const logResponse = await fetch(`https://api.github.com/repos/casp3rgr33n/nadirtools/actions/jobs/${failedJob.id}/logs`, { headers });
      if (logResponse.ok) {
        const logs = await logResponse.text();
        console.log('--- LOGS ---');
        console.log(logs.slice(-1000)); // print last 1000 chars
      }
    }
  } catch (err) {
    console.error('Error fetching actions:', err);
  }
}

checkActions();
