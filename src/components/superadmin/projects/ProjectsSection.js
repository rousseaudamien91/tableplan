/* eslint-disable */
import { useI18n } from "../../theme";
import { Btn, Badge } from "../../components/UI";
import { C } from "../../constants";
import { THEMES_CONFIG } from "../../constants";

export default function ProjectsSection({ events, setEvents, users, cardStyle }) {
  const { t } = useI18n();

  const openProject = (id) => {
    // Deep-link simple vers l’app (à adapter selon ton routing)
    window.location.href = "/app?projectId=" + id;
  };

  return (
    <>
      <div style={{display:"flex",alignItems:"center",marginBottom:28}}>
        <div>
          <h2 style={{margin:0,fontSize:24,fontWeight:700}}>
            {t("superadmin.projects.title")}
          </h2>
          <p style={{color:"rgba(255,255,255,0.4)",margin:"4px 0 0",fontSize:13}}>
            {events.length} {t("superadmin.projects.count", { count: events.length })}
          </p>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
        {events.map(ev => {
          const owner = users.find(u => u.id === ev.ownerId);
          const theme = THEMES_CONFIG[ev.type] || THEMES_CONFIG.autre;

          const status = ev.status || "draft";
          const plan = ev.plan || "free";

          const statusLabel = {
            draft: t("superadmin.projects.status.draft"),
            active: t("superadmin.projects.status.active"),
            archived: t("superadmin.projects.status.archived")
          }[status];

          const statusColor = {
            draft: "#C9973A",
            active: "#27AE60",
            archived: "#8A7355"
          }[status];

          const planLabel = {
            free: t("superadmin.projects.plan.free"),
            medium: t("superadmin.projects.plan.medium"),
            full: t("superadmin.projects.plan.full")
          }[plan];

          return (
            <div key={ev.id} style={cardStyle}>
              {/* Header */}
              <div style={{display:"flex",alignItems:"start",gap:12,marginBottom:12}}>
                <span style={{fontSize:28}}>{theme.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:600,marginBottom:2}}>{ev.name}</div>
                  <div style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>{ev.date}</div>
                </div>
                <Badge color={theme.color}>{theme.label}</Badge>
              </div>

              {/* Infos */}
              <div style={{display:"flex",gap:16,fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:12,flexWrap:"wrap"}}>
                <span>🪑 {(ev.tables||[]).length} {t("superadmin.projects.tables")}</span>
                <span>👤 {(ev.guests||[]).length} {t("superadmin.projects.guests")}</span>

                <span style={{display:"inline-flex",alignItems:"center",gap:6}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:statusColor}}/>
                  <span style={{color:statusColor,fontWeight:600}}>{statusLabel}</span>
                </span>

                <span style={{display:"inline-flex",alignItems:"center",gap:6}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:"#C9973A"}}/>
                  <span style={{color:"#C9973A",fontWeight:600}}>{planLabel}</span>
                </span>
              </div>

              {/* Footer */}
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{
                  width:24,height:24,borderRadius:"50%",
                  background:C.gold+"33",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color:"#C9973A",fontSize:10,fontWeight:700
                }}>
                  {owner?.avatar || "?"}
                </div>

                <span style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>
                  {owner?.name || t("superadmin.projects.noOwner")}
                </span>

                <div style={{flex:1}}/>

                <Btn small variant="ghost" onClick={() => openProject(ev.id)}>
                  {t("superadmin.projects.open")}
                </Btn>

                <Btn small variant="danger" onClick={() => setEvents(prev => prev.filter(e => e.id !== ev.id))}>
                  {t("superadmin.projects.delete")}
                </Btn>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
