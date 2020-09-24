export let typeRelations = [
	{"id": 5, "nom": "Synonymes"},
	{"id": 6, "nom": "Génériques"},
	{"id": 7, "nom": "Antonymes"},
	{"id": 8, "nom": "Spécifiques"},
	{"id": 9, "nom": "Parties"},
	{"id": 10, "nom": "Holonymes"},
	{"id": 11, "nom": "Locutions"},
	{"id": 13, "nom": "Agents"},
	{"id": 14, "nom": "Patients"},
	{"id": 15, "nom": "Lieux"},
	{"id": 16, "nom": "Instruments"},
	{"id": 17, "nom": "Caractéristiques"},
	{"id": 19, "nom": "Lemmes"}
];

export function getRelationById(id: number) {
	return typeRelations.filter(r => (r.id == id))[0];
}