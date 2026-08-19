import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [users] = await connection.query("SELECT id FROM users ORDER BY id LIMIT 3");
const ids = users.length ? users.map(user => user.id) : [1, 1, 1];

const projects = [
  { title: "SignalGarden", description: "A privacy-preserving reputation layer for autonomous DeFi agents, with explainable signals and verifiable track records.", category: "DeFi", goal: 24000 },
  { title: "Transit Mesh", description: "Open infrastructure for machine-to-machine payments across public transit and last-mile delivery networks.", category: "DePIN", goal: 42000 },
  { title: "Mosaic Social", description: "Portable community spaces where members own the social graph and curate collaborative rooms.", category: "Social", goal: 18000 },
];

for (let index = 0; index < projects.length; index += 1) {
  const item = projects[index];
  const [result] = await connection.query("INSERT INTO projects (creatorId, title, description, category, goalUsdc, status, chain) VALUES (?, ?, ?, ?, ?, 'Active', 'Arbitrum Sepolia')", [ids[index % ids.length], item.title, item.description, item.category, item.goal]);
  const projectId = result.insertId;
  const milestones = [
    ["Prototype shipped", "A working public demo with the core user journey.", Math.round(item.goal * 0.35), "Released"],
    ["Pilot evidence", "Usage evidence from an initial cohort and a reproducible proof link.", Math.round(item.goal * 0.35), index === 1 ? "Approved" : "Submitted"],
    ["Public release", "A stable release with deployment steps and operating metrics.", item.goal - Math.round(item.goal * 0.7), "Pending"],
  ];
  for (let position = 0; position < milestones.length; position += 1) {
    const [title, description, amount, status] = milestones[position];
    const proofUrl = status === "Pending" ? null : `https://github.com/proofmesh/${item.title.toLowerCase().replaceAll(" ", "-")}`;
    await connection.query("INSERT INTO milestones (projectId, position, title, description, amountUsdc, proofUrl, proofDescription, status, submittedAt, approvedAt, releasedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [projectId, position + 1, title, description, amount, proofUrl, proofUrl ? "Public evidence for the milestone deliverable." : null, status, proofUrl ? new Date() : null, status === "Approved" || status === "Released" ? new Date() : null, status === "Released" ? new Date() : null]);
  }
  await connection.query("INSERT INTO contributions (projectId, funderId, amountUsdc, txHash) VALUES (?, ?, ?, ?), (?, ?, ?, ?)", [projectId, ids[(index + 1) % ids.length], Math.round(item.goal * 0.4), `0xdemo-pledge-${index}-a`, projectId, ids[(index + 2) % ids.length], Math.round(item.goal * 0.3), `0xdemo-pledge-${index}-b`]);
  const [milestoneRows] = await connection.query("SELECT id, amountUsdc, status FROM milestones WHERE projectId = ?", [projectId]);
  const reviewMilestone = milestoneRows.find(row => row.status === "Submitted") ?? milestoneRows[0];
  if (reviewMilestone) await connection.query("INSERT INTO proofReviews (milestoneId, reviewerType, recommendation, confidence, rationale, checksJson) VALUES (?, 'AI', 'Approve', 92, ?, ?)", [reviewMilestone.id, "The proof link is specific, accessible, and maps to the milestone deliverable.", JSON.stringify(["URL resolves", "Deliverable match", "Reproducible path"])]);
  const releasedMilestone = milestoneRows.find(row => row.status === "Released");
  if (releasedMilestone) await connection.query("INSERT INTO releases (milestoneId, projectId, amountUsdc, txHash, network) VALUES (?, ?, ?, ?, 'Arbitrum Sepolia')", [releasedMilestone.id, projectId, releasedMilestone.amountUsdc, `0xdemo-release-${index}`]);
  await connection.query("INSERT INTO notifications (userId, type, title, body, projectId, milestoneId) VALUES (?, 'contribution_received', 'New funding pledge', ?, ?, ?), (?, 'proof_submitted', 'Proof submitted', ?, ?, ?)", [ids[index % ids.length], `${item.title} received a new pledge.`, projectId, reviewMilestone?.id ?? null, ids[index % ids.length], `A milestone proof is ready for review on ${item.title}.`, projectId, reviewMilestone?.id ?? null]);
}

await connection.end();
console.log("ProofMesh demo data seeded.");
