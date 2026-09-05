-- CreateIndex
CREATE INDEX "agendamentos_email_data_horario_idx" ON "agendamentos"("email", "data", "horario");

-- CreateIndex
CREATE INDEX "agendamentos_status_idx" ON "agendamentos"("status");

-- CreateIndex
CREATE INDEX "agendamentos_nome_idx" ON "agendamentos"("nome");

-- CreateIndex
CREATE INDEX "agendamentos_email_idx" ON "agendamentos"("email");

-- CreateIndex
CREATE INDEX "procedimentos_ativa_idx" ON "procedimentos"("ativa");
