
// Rôles par type d'événement
export var ROLES_BY_TYPE = {
  mariage: [
    { id:"marie1",        icon:"💍", label:"Marié(e) 1",       color:"#F0C97A" },
    { id:"marie2",        icon:"💍", label:"Marié(e) 2",       color:"#F0C97A" },
    { id:"temoin1",       icon:"🎖", label:"Témoin 1",          color:"#C9973A" },
    { id:"temoin2",       icon:"🎖", label:"Témoin 2",          color:"#C9973A" },
    { id:"famille_marie1",icon:"👨‍👩‍👧", label:"Famille Marié(e) 1", color:"#8B7EC8" },
    { id:"famille_marie2",icon:"👨‍👩‍👧", label:"Famille Marié(e) 2", color:"#E8845A" },
    { id:"ami_proche",    icon:"⭐", label:"Ami proche",        color:"#4CAF50" },
    { id:"enfant",        icon:"🧒", label:"Enfant",            color:"#29B6F6" },
    { id:"vip",           icon:"🌟", label:"VIP",               color:"#FFD700" },
    { id:"prestataire",   icon:"🔧", label:"Prestataire",       color:"rgba(255,255,255,0.35)" },
  ],
  gala: [
    { id:"vip",           icon:"🌟", label:"VIP",               color:"#FFD700" },
    { id:"intervenant",   icon:"🎤", label:"Intervenant",       color:"#F0C97A" },
    { id:"sponsor",       icon:"💼", label:"Sponsor",           color:"#C9973A" },
    { id:"presse",        icon:"📰", label:"Presse",            color:"#8B7EC8" },
    { id:"staff",         icon:"🔧", label:"Staff",             color:"rgba(255,255,255,0.35)" },
  ],
  anniversaire: [
    { id:"fete",          icon:"🎂", label:"Fêté(e)",           color:"#F0C97A" },
    { id:"famille",       icon:"👨‍👩‍👧", label:"Famille",           color:"#8B7EC8" },
    { id:"ami_proche",    icon:"⭐", label:"Ami proche",        color:"#4CAF50" },
    { id:"enfant",        icon:"🧒", label:"Enfant",            color:"#29B6F6" },
  ],
  conference: [
    { id:"intervenant",   icon:"🎤", label:"Intervenant",       color:"#F0C97A" },
    { id:"moderateur",    icon:"🎯", label:"Modérateur",        color:"#C9973A" },
    { id:"vip",           icon:"🌟", label:"VIP",               color:"#FFD700" },
    { id:"participant",   icon:"👤", label:"Participant",       color:"rgba(255,255,255,0.45)" },
    { id:"presse",        icon:"📰", label:"Presse",            color:"#8B7EC8" },
    { id:"staff",         icon:"🔧", label:"Staff",             color:"rgba(255,255,255,0.35)" },
  ],
  autre: [
    { id:"vip",           icon:"🌟", label:"VIP",               color:"#FFD700" },
    { id:"famille",       icon:"👨‍👩‍👧", label:"Famille",           color:"#8B7EC8" },
    { id:"ami_proche",    icon:"⭐", label:"Ami proche",        color:"#4CAF50" },
    { id:"enfant",        icon:"🧒", label:"Enfant",            color:"#29B6F6" },
    { id:"staff",         icon:"🔧", label:"Staff",             color:"rgba(255,255,255,0.35)" },
  ],
};

export function getRolesForType(type) {
  return ROLES_BY_TYPE[type] || ROLES_BY_TYPE.autre;
}
