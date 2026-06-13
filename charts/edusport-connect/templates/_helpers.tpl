{{/*
Labels communs ÉduSport Connect
*/}}
{{- define "esc.labels" -}}
app.kubernetes.io/part-of: edusport-connect
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "esc.namespace" -}}
{{- .Values.namespace | default "edusport-connect" -}}
{{- end -}}

{{- define "esc.frontend.selectorLabels" -}}
app: edusport-connect-frontend
{{- end -}}
