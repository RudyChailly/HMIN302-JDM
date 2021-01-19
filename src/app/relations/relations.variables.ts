export let typeRelations = [
  {"id": 0, "nom": "Idées associées", "short": "ASOC"},
	{"id": 5, "nom": "Synonymes", "short": "SYN"},
	{"id": 6, "nom": "Génériques", "short": "GÉN"},
	{"id": 7, "nom": "Antonymes", "short": "ANTO"},
	{"id": 8, "nom": "Spécifiques", "short": "SPÉC"},
	{"id": 9, "nom": "Parties", "short": "PART"},
	{"id": 10, "nom": "Holonymes", "short": "HOLO"},
	{"id": 11, "nom": "Locutions", "short": "LOCU"},
	{"id": 13, "nom": "Agents", "short": "AG"},
	{"id": 14, "nom": "Patients", "short": "PAT"},
	{"id": 15, "nom": "Lieux", "short": "LIEU"},
	{"id": 16, "nom": "Instruments", "short": "INSTR"},
	{"id": 17, "nom": "Caractéristiques", "short": "CARAC"},
	{"id": 19, "nom": "Lemmes", "short": "LEM"}
];

export function getRelationById(id: number) {
	return typeRelations.filter(r => (r.id == id))[0];
}
