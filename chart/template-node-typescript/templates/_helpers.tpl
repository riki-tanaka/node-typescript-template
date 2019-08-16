{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "template-node-typescript.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "template-node-typescript.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "template-node-typescript.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "template-node-typescript.host" -}}
{{- $chartName := default .Chart.Name .Values.nameOverride -}}
{{- $host := default $chartName .Values.ingress.host -}}
{{- if .Values.ingress.namespaceInHost -}}
{{- printf "%s-%s.%s" $host .Release.Namespace .Values.ingress.subdomain -}}
{{- else -}}
{{- printf "%s.%s" $host .Values.ingress.subdomain -}}
{{- end -}}
{{- end -}}

{{- define "template-node-typescript.url" -}}
{{- $host := include "template-node-typescript.host" . -}}
{{- if .Values.ingress.tlsSecretName -}}
{{- printf "https://%s" $host -}}
{{- else -}}
{{- printf "http://%s" $host -}}
{{- end -}}
{{- end -}}

{{- define "template-node-typescript.protocols" -}}
{{- if .Values.ingress.tlsSecretName -}}
{{- printf "%s,%s" "http" "https" -}}
{{- else -}}
{{- printf "%s" "http" -}}
{{- end -}}
{{- end -}}
