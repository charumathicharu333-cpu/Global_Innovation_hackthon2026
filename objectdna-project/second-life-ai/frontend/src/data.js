const pathwayTemplates = {
  REPAIR: { label: 'Repair', icon: 'wrench', description: 'Fix the object and keep its original purpose.', tone: 'violet' },
  REUSE: { label: 'Reuse', icon: 'refresh', description: 'Keep using it as-is or in the same role.', tone: 'teal' },
  REPURPOSE: { label: 'Repurpose', icon: 'sparkles', description: 'Transform it into something useful and new.', tone: 'indigo' },
  DONATE: { label: 'Donate', icon: 'gift', description: 'Pass it to a person or community that needs it.', tone: 'rose' },
  RECOVER: { label: 'Recover', icon: 'recycle', description: 'Separate materials and recover what can be used.', tone: 'amber' },
}

function pathway(type, title, description, scores, estimates) {
  return {
    type,
    title,
    description,
    estimated_cost: estimates.cost,
    effort: estimates.effort,
    skill: estimates.skill,
    time: estimates.time,
    estimated_value: estimates.value,
    reuse_score: scores.reuse,
    impact_score: scores.impact,
    practicality_score: scores.practicality,
    cost_efficiency_score: scores.cost,
    effort_score: scores.effort,
    time_score: scores.time,
    life_path_score: scores.life,
  }
}

function createAnalysis(config) {
  const best = config.pathways.find((item) => item.type === config.recommended_action)
  return {
    ...config,
    demo_data: true,
    source_label: 'Demo analysis',
    object: { name: config.object_name, confidence: config.confidence },
    condition_assessment: { label: config.condition, score: config.condition_score, reasoning: config.visible_damage },
    materials: config.materials,
    components: config.materials,
    life_path_score: best?.life_path_score || 0,
    score_breakdown: best ? {
      practicality: best.practicality_score,
      reuse_potential: best.reuse_score,
      environmental_impact: best.impact_score,
      cost_efficiency: best.cost_efficiency_score,
      effort: best.effort_score,
      time: best.time_score,
    } : {},
    recommendation: {
      pathway: config.recommended_action,
      title: best?.title || 'Keep exploring the options',
      reason: config.recommendation_reason,
      steps: config.action_plan,
    },
  }
}

const tablePathways = [
  pathway('REPAIR', 'Repair the table', 'Stabilize the damaged support and keep it as a table.', { reuse: 92, impact: 89, practicality: 84, cost: 82, effort: 70, time: 72, life: 84 }, { cost: 'Low', effort: 'Medium', skill: 'Basic DIY', time: '2–4 hrs', value: '$$' }),
  pathway('REUSE', 'Use it as a work surface', 'Keep the table in service after a clean and light reinforcement.', { reuse: 88, impact: 86, practicality: 80, cost: 90, effort: 78, time: 80, life: 84 }, { cost: 'Very low', effort: 'Low', skill: 'None', time: '1 hr', value: '$' }),
  pathway('REPURPOSE', 'Convert it into a bookshelf', 'Recover the solid wooden structure as open shelving.', { reuse: 96, impact: 93, practicality: 91, cost: 86, effort: 78, time: 76, life: 87 }, { cost: 'Low', effort: 'Medium', skill: 'Basic DIY', time: '3–5 hrs', value: '$$$' }),
  pathway('DONATE', 'Donate for parts or repair', 'Offer the table to a maker, repairer, or community workshop.', { reuse: 80, impact: 85, practicality: 74, cost: 98, effort: 90, time: 88, life: 82 }, { cost: 'Free', effort: 'Low', skill: 'None', time: '1 day', value: '$' }),
  pathway('RECOVER', 'Recover the materials', 'Disassemble safely and separate wood, metal, and finish.', { reuse: 68, impact: 72, practicality: 62, cost: 68, effort: 52, time: 54, life: 63 }, { cost: 'Low', effort: 'High', skill: 'Some DIY', time: '2–3 hrs', value: '$' }),
]

export const sampleObjects = {
  table: createAnalysis({
    key: 'table', label: 'Broken Wooden Table', shortLabel: 'Wooden table', icon: 'table', art: 'art-table', category: 'Furniture',
    object_name: 'Wooden Table', confidence: 94, condition: 'Repairable', condition_score: 72,
    description: 'The main wooden structure appears usable from the visible view, with surface wear and one damaged support area.',
    visible_damage: ['Surface scratches detected', 'One support area appears damaged', 'Main wooden structure appears usable', 'Hidden structural damage cannot be assessed from one photo'],
    materials: [{ name: 'Tabletop', material: 'Wood', reuse_potential: 'High' }, { name: 'Legs and frame', material: 'Wood', reuse_potential: 'High' }, { name: 'Screws and brackets', material: 'Metal', reuse_potential: 'Medium' }, { name: 'Surface coating', material: 'Finish', reuse_potential: 'Low' }],
    recommended_action: 'REPURPOSE', recommendation_reason: 'Most of the wooden structure can be kept, the material cost stays low, and a bookshelf gives the damaged frame a useful new role.',
    repairable: true, reusable: true, donatable: true, recyclable: true, second_life_ideas: ['Bookshelf', 'Plant stand', 'Entryway storage unit', 'Wall shelf', 'Workshop bench'],
    pathways: tablePathways, estimated_waste_avoided_kg: 12.4, estimated_co2_avoided_kg: 18.6, material_recovery_kg: 9.1,
    safety_notes: ['Visual assessment only. Check stability before putting weight on it.', 'Wear eye protection when cutting, drilling, or sanding.'],
    action_plan: ['Clean the surface and inspect every joint.', 'Remove the damaged support and measure the frame.', 'Reinforce the frame and add shelf boards.', 'Sand rough edges and apply a low-VOC finish.', 'Load-test the bookshelf gradually before everyday use.'],
  }),
  chair: createAnalysis({
    key: 'chair', label: 'Old Chair', shortLabel: 'Old chair', icon: 'chair', art: 'art-chair', category: 'Furniture', object_name: 'Wooden Chair', confidence: 91, condition: 'Needs Repair', condition_score: 64,
    description: 'The chair looks structurally promising, although one joint and the worn seat need attention before use.', visible_damage: ['Worn seat surface', 'Loose-looking side joint', 'Frame appears intact from the visible view'],
    materials: [{ name: 'Frame', material: 'Wood', reuse_potential: 'High' }, { name: 'Seat', material: 'Wood / fabric', reuse_potential: 'Medium' }, { name: 'Fasteners', material: 'Metal', reuse_potential: 'Medium' }], recommended_action: 'REPAIR', recommendation_reason: 'A small repair and new seat cover can return the chair to safe everyday use with minimal new material.', repairable: true, reusable: true, donatable: true, recyclable: true, second_life_ideas: ['Repair as a dining chair', 'Turn into a plant stand', 'Use as a bedside valet', 'Donate to a repair cafe'], pathways: [pathway('REPAIR', 'Repair for everyday seating', 'Tighten the joints and replace the seat covering.', { reuse: 94, impact: 88, practicality: 89, cost: 84, effort: 76, time: 75, life: 87 }, { cost: 'Low', effort: 'Medium', skill: 'Basic DIY', time: '2–3 hrs', value: '$$' }), pathway('REUSE', 'Use as a display stand', 'Keep it intact and use it for lightweight objects.', { reuse: 78, impact: 78, practicality: 80, cost: 96, effort: 90, time: 92, life: 82 }, { cost: 'Free', effort: 'Low', skill: 'None', time: '15 min', value: '$' }), pathway('REPURPOSE', 'Make a plant stand', 'Remove the seat and create a stable plant platform.', { reuse: 90, impact: 86, practicality: 83, cost: 82, effort: 75, time: 73, life: 83 }, { cost: 'Low', effort: 'Medium', skill: 'Basic DIY', time: '2 hrs', value: '$$' }), pathway('DONATE', 'Donate to a repairer', 'Let a local maker restore and pass it on.', { reuse: 84, impact: 87, practicality: 77, cost: 98, effort: 88, time: 84, life: 83 }, { cost: 'Free', effort: 'Low', skill: 'None', time: '1 day', value: '$' }), pathway('RECOVER', 'Recover wood and metal', 'Separate the frame for future making.', { reuse: 66, impact: 68, practicality: 60, cost: 70, effort: 53, time: 52, life: 61 }, { cost: 'Low', effort: 'High', skill: 'Some DIY', time: '2 hrs', value: '$' })], estimated_waste_avoided_kg: 4.8, estimated_co2_avoided_kg: 7.4, material_recovery_kg: 3.1, safety_notes: ['Do not use for seating until joints are stable and load-tested.'], action_plan: ['Tighten and glue loose joints.', 'Replace or re-cover the seat.', 'Sand sharp edges and refinish.', 'Test with light weight before normal use.'],
  }),
  backpack: createAnalysis({
    key: 'backpack', label: 'Old Backpack', shortLabel: 'Old backpack', icon: 'backpack', art: 'art-backpack', category: 'Textiles', object_name: 'Everyday Backpack', confidence: 93, condition: 'Usable', condition_score: 78,
    description: 'The bag appears usable with wear at the base and straps that should be checked before carrying weight.', visible_damage: ['Fabric wear at the base', 'Straps appear intact', 'Zippers are visible but should be tested'], materials: [{ name: 'Body', material: 'Nylon textile', reuse_potential: 'High' }, { name: 'Straps', material: 'Webbing', reuse_potential: 'High' }, { name: 'Zippers', material: 'Metal / plastic', reuse_potential: 'Medium' }], recommended_action: 'REUSE', recommendation_reason: 'Cleaning and reinforcing high-wear areas can keep the backpack in its highest-value use for longer.', repairable: true, reusable: true, donatable: true, recyclable: true, second_life_ideas: ['Continue using after repair', 'Donate to a student', 'Convert into a bike pannier', 'Use for tool storage'], pathways: [pathway('REPAIR', 'Patch and keep carrying', 'Reinforce the base and replace a tired zipper pull.', { reuse: 92, impact: 86, practicality: 87, cost: 84, effort: 82, time: 84, life: 86 }, { cost: 'Low', effort: 'Low', skill: 'Basic sewing', time: '1 hr', value: '$$' }), pathway('REUSE', 'Keep using it as a backpack', 'Clean, inspect, and continue its primary use.', { reuse: 96, impact: 90, practicality: 94, cost: 98, effort: 92, time: 92, life: 92 }, { cost: 'Free', effort: 'Very low', skill: 'None', time: '30 min', value: '$$' }), pathway('REPURPOSE', 'Make a tool bag', 'Use the compartments for craft or workshop storage.', { reuse: 82, impact: 80, practicality: 78, cost: 90, effort: 78, time: 78, life: 79 }, { cost: 'Very low', effort: 'Low', skill: 'Basic DIY', time: '1 hr', value: '$' }), pathway('DONATE', 'Pass it to a student', 'Donate after cleaning and testing the straps.', { reuse: 91, impact: 89, practicality: 86, cost: 98, effort: 82, time: 80, life: 87 }, { cost: 'Free', effort: 'Low', skill: 'None', time: '1 day', value: '$' }), pathway('RECOVER', 'Recover textile panels', 'Use sound fabric sections for patches or small projects.', { reuse: 61, impact: 65, practicality: 58, cost: 72, effort: 56, time: 50, life: 59 }, { cost: 'Free', effort: 'Medium', skill: 'Sewing', time: '2 hrs', value: '$' })], estimated_waste_avoided_kg: 0.8, estimated_co2_avoided_kg: 4.2, material_recovery_kg: 0.45, safety_notes: ['Check straps and stitching before carrying heavy loads.'], action_plan: ['Empty and clean all compartments.', 'Patch the worn base or reinforce it with fabric.', 'Test the zippers and straps.', 'Keep using it or pass it on to a student.'],
  }),
  electronics: createAnalysis({
    key: 'electronics', label: 'Broken Electronics', shortLabel: 'Broken electronics', icon: 'cpu', art: 'art-electronics', category: 'Electronics', object_name: 'Small Electronic Device', confidence: 86, condition: 'Damaged', condition_score: 41,
    description: 'The device shows visible wear and may have a repairable external fault, but internal condition cannot be confirmed from one image.', visible_damage: ['Cracked or worn outer casing', 'Cable / port area needs inspection', 'Battery and internal components are not visible'], materials: [{ name: 'Circuit board', material: 'Mixed metals', reuse_potential: 'Medium' }, { name: 'Casing', material: 'Plastic', reuse_potential: 'Low' }, { name: 'Cable', material: 'Copper / polymer', reuse_potential: 'Medium' }], recommended_action: 'RECOVER', recommendation_reason: 'Responsible electronics recovery is the safest default until a qualified repairer checks the device and battery condition.', repairable: true, reusable: false, donatable: false, recyclable: true, second_life_ideas: ['Qualified repair assessment', 'Recover circuit board components', 'Responsible electronics recycling', 'Reuse intact cable or adapter'], pathways: [pathway('REPAIR', 'Get a qualified repair check', 'Ask a repairer to inspect the device and battery.', { reuse: 76, impact: 80, practicality: 64, cost: 45, effort: 58, time: 55, life: 66 }, { cost: 'Medium', effort: 'Medium', skill: 'Specialist', time: '1–7 days', value: '$$' }), pathway('REUSE', 'Use only if fully tested', 'Continue using only after safety checks and a successful test.', { reuse: 70, impact: 72, practicality: 55, cost: 80, effort: 60, time: 60, life: 64 }, { cost: 'Low', effort: 'Medium', skill: 'Specialist', time: '1 day', value: '$' }), pathway('REPURPOSE', 'Salvage safe modules', 'Reuse non-hazardous accessories or enclosure parts.', { reuse: 64, impact: 69, practicality: 51, cost: 72, effort: 48, time: 44, life: 57 }, { cost: 'Low', effort: 'High', skill: 'Advanced', time: '2–4 hrs', value: '$' }), pathway('DONATE', 'Offer to a repair classroom', 'Pass it on only with an honest fault description.', { reuse: 63, impact: 73, practicality: 58, cost: 98, effort: 75, time: 75, life: 65 }, { cost: 'Free', effort: 'Low', skill: 'None', time: '1 day', value: '$' }), pathway('RECOVER', 'Recycle electronics responsibly', 'Use an approved e-waste route to recover materials.', { reuse: 73, impact: 92, practicality: 88, cost: 92, effort: 84, time: 82, life: 79 }, { cost: 'Low', effort: 'Low', skill: 'None', time: '1 day', value: '$' })], estimated_waste_avoided_kg: 0.7, estimated_co2_avoided_kg: 2.4, material_recovery_kg: 0.3, safety_notes: ['Do not open, puncture, crush, or charge a damaged battery.', 'Use a certified electronics collection point.'], action_plan: ['Stop using it if it is hot, swollen, or smells unusual.', 'Check the model with a qualified repairer.', 'Back up personal data if it still powers on.', 'Take it to a certified e-waste collection point.'],
  }),
  container: createAnalysis({
    key: 'container', label: 'Plastic Container', shortLabel: 'Plastic container', icon: 'bottle', art: 'art-container', category: 'Plastic', object_name: 'Plastic Container', confidence: 96, condition: 'Usable', condition_score: 83,
    description: 'The container appears intact and can stay useful for storage or a simple non-food household reuse.', visible_damage: ['Surface scuffing', 'Container appears intact', 'Lid fit should be tested'], materials: [{ name: 'Container body', material: 'Plastic', reuse_potential: 'High' }, { name: 'Lid', material: 'Plastic', reuse_potential: 'High' }], recommended_action: 'REUSE', recommendation_reason: 'A clean, intact container can replace a new storage item with almost no added cost or effort.', repairable: false, reusable: true, donatable: false, recyclable: true, second_life_ideas: ['Desk storage', 'Planter for a small herb', 'Hardware organizer', 'Craft supply container'], pathways: [pathway('REPAIR', 'Replace or secure the lid', 'Only repair the lid if the container remains safe and clean.', { reuse: 75, impact: 69, practicality: 70, cost: 86, effort: 86, time: 86, life: 76 }, { cost: 'Very low', effort: 'Low', skill: 'None', time: '15 min', value: '$' }), pathway('REUSE', 'Use as storage', 'Clean and keep it in a useful household role.', { reuse: 95, impact: 86, practicality: 96, cost: 98, effort: 97, time: 96, life: 93 }, { cost: 'Free', effort: 'Very low', skill: 'None', time: '10 min', value: '$' }), pathway('REPURPOSE', 'Make a planter', 'Add drainage and use it for a small non-food plant.', { reuse: 89, impact: 79, practicality: 87, cost: 92, effort: 84, time: 82, life: 86 }, { cost: 'Very low', effort: 'Low', skill: 'Basic DIY', time: '30 min', value: '$' }), pathway('DONATE', 'Pass on for storage', 'Offer it to a classroom or community organizer.', { reuse: 76, impact: 72, practicality: 65, cost: 98, effort: 88, time: 78, life: 72 }, { cost: 'Free', effort: 'Low', skill: 'None', time: '1 day', value: '$' }), pathway('RECOVER', 'Recycle by resin code', 'Clean it and use the right local recycling stream.', { reuse: 68, impact: 78, practicality: 82, cost: 95, effort: 90, time: 85, life: 76 }, { cost: 'Free', effort: 'Low', skill: 'None', time: '10 min', value: '$' })], estimated_waste_avoided_kg: 0.2, estimated_co2_avoided_kg: 0.4, material_recovery_kg: 0.12, safety_notes: ['Do not reuse for food unless the original material and condition are known to be food-safe.'], action_plan: ['Wash and dry the container.', 'Check the lid and remove labels.', 'Choose storage or a low-risk craft use.', 'Recycle it once it is cracked or contaminated.'],
  }),
}

export const optionMeta = Object.fromEntries(Object.entries(pathwayTemplates).map(([key, value]) => [key, value]))

export const analysisSteps = [
  { number: '01', icon: 'scan', label: 'SEE', detail: 'Identifying object and visual characteristics...' },
  { number: '02', icon: 'eye', label: 'UNDERSTAND', detail: 'Assessing visible wear and condition...' },
  { number: '03', icon: 'layers', label: 'DECOMPOSE', detail: 'Mapping materials and components...' },
  { number: '04', icon: 'sparkles', label: 'REIMAGINE', detail: 'Generating possible next lives...' },
  { number: '05', icon: 'chart', label: 'COMPARE', detail: 'Scoring cost, effort, time, and impact...' },
  { number: '06', icon: 'leaf', label: 'EXTEND LIFE', detail: 'Selecting the most practical path...' },
]

export const getFallbackResult = (key = 'table') => ({ ...(sampleObjects[key] || sampleObjects.table), demo_data: true, source_label: 'Demo analysis' })
