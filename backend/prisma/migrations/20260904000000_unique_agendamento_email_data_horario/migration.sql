-- CreateIndex
CREATE UNIQUE INDEX "agendamentos_email_data_horario_key" ON "agendamentos"("email", "data", "horario");
