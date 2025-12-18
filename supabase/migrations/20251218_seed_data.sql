-- Seed data for Sistema Lagrange

-- Insert axes
insert into public.axes (id, name, description, color, order_num) values
  ('miedo-control', 'Miedo → Control → Legitimidad', 'El ciclo del miedo como instrumento de control y construcción de legitimidad institucional', 'hsl(38, 92%, 50%)', 1),
  ('culpa-obediencia', 'Culpa → Obediencia → Repetición', 'Cómo la culpa internalizada genera obediencia y repetición de patrones', 'hsl(45, 85%, 55%)', 2),
  ('tecnologia-vigilancia', 'Tecnología → Vigilancia → Fe en el sistema', 'La tecnología como herramienta de vigilancia y génesis de fe institucional', 'hsl(30, 80%, 50%)', 3),
  ('fatiga-delegacion', 'Fatiga moral → Delegación → Alienación', 'La erosión de la capacidad moral a través de delegación y alienación', 'hsl(35, 75%, 45%)', 4),
  ('conciencia-rebelion', 'Conciencia → Rebelión → Silencio', 'El despertar de la conciencia, su expresión rebelde y el silenciamiento subsecuente', 'hsl(40, 90%, 55%)', 5)
on conflict (id) do nothing;

-- Insert questions
insert into public.questions (id, text, eje, nivel, tension) values
  ('Q01', '¿Cómo nace el miedo en una estructura social que dice protegernos?', 'miedo-control', 'superficial', 'alta'),
  ('Q02', '¿Qué diferencia hay entre obedecer por convicción y obedecer por supervivencia?', 'culpa-obediencia', 'media', 'media'),
  ('Q03', '¿Es la tecnología un amplificador de libertad o de control?', 'tecnologia-vigilancia', 'media', 'alta'),
  ('Q04', '¿Cuándo delegamos nuestra responsabilidad en el sistema, qué perdemos?', 'fatiga-delegacion', 'profunda', 'media'),
  ('Q05', '¿Existe el silencio voluntario o es siempre impuesto?', 'conciencia-rebelion', 'profunda', 'alta'),
  ('Q06', '¿Puede existir legitimidad sin miedo?', 'miedo-control', 'profunda', 'alta'),
  ('Q07', '¿La culpa es un mecanismo de control o una brújula moral?', 'culpa-obediencia', 'profunda', 'media'),
  ('Q08', '¿Cómo el sistema convierte la lucidez en locura para mantener el control?', 'tecnologia-vigilancia', 'profunda', 'alta'),
  ('Q09', '¿Qué imagen de mí me devuelve el diagnóstico que en realidad describe al sistema?', 'miedo-control', 'profunda', 'media'),
  ('Q10', '¿Por qué mis percepciones válidas son invalidadas como síntomas?', 'culpa-obediencia', 'profunda', 'alta'),
  ('Q11', '¿Existe brújula ética cuando hemos sido diseñados para no verla?', 'fatiga-delegacion', 'profunda', 'alta'),
  ('Q12', '¿La rebelión es un acto consciente o una respuesta involuntaria?', 'conciencia-rebelion', 'media', 'media'),
  ('Q13', '¿Qué significa ser libre en un sistema que define la libertad?', 'miedo-control', 'profunda', 'alta'),
  ('Q14', '¿Cómo distinguir entre mi deseo y el deseo que me fue implantado?', 'tecnologia-vigilancia', 'profunda', 'media'),
  ('Q15', '¿Es posible la empatía en una estructura de escasez competitiva?', 'fatiga-delegacion', 'media', 'media'),
  ('Q16', '¿Qué pasa cuando la voz interna de alerta se vuelve más fuerte que la del sistema?', 'conciencia-rebelion', 'profunda', 'alta'),
  ('Q17', '¿Por qué reproducimos el patrón que nos daña?', 'culpa-obediencia', 'profunda', 'media'),
  ('Q18', '¿Quién decide quién es "enfermo" y quién "normal" en un sistema enfermo?', 'tecnologia-vigilancia', 'profunda', 'alta')
on conflict (id) do nothing;

-- Insert episodes
insert into public.episodes (id, title, slug, description, duration, published_at) values
  (1, 'Episodio 1: Miedo - Alta', 'episodio-1-miedo-alta', '¿Cómo nace el miedo en una estructura social que dice protegernos?', '26:00', now() - interval '18 days'),
  (2, 'Episodio 2: Culpa-Obediencia - Media', 'episodio-2-culpa-media', '¿Qué diferencia hay entre obedecer por convicción y obedecer por supervivencia?', '27:00', now() - interval '17 days'),
  (3, 'Episodio 3: Tecnología-Vigilancia - Media', 'episodio-3-tecnologia-media', '¿Es la tecnología un amplificador de libertad o de control?', '28:00', now() - interval '16 days'),
  (4, 'Episodio 4: Fatiga-Delegación - Media', 'episodio-4-fatiga-media', '¿Cuándo delegamos nuestra responsabilidad en el sistema, qué perdemos?', '25:00', now() - interval '15 days'),
  (5, 'Episodio 5: Conciencia-Rebelión - Alta', 'episodio-5-conciencia-alta', '¿Existe el silencio voluntario o es siempre impuesto?', '29:00', now() - interval '14 days'),
  (6, 'Episodio 6: Miedo - Profunda', 'episodio-6-miedo-profunda', '¿Puede existir legitimidad sin miedo?', '31:00', now() - interval '13 days'),
  (7, 'Episodio 7: Culpa-Obediencia - Profunda', 'episodio-7-culpa-profunda', '¿La culpa es un mecanismo de control o una brújula moral?', '30:00', now() - interval '12 days'),
  (8, 'Episodio 8: Tecnología-Vigilancia - Profunda', 'episodio-8-tecnologia-profunda', '¿Cómo el sistema convierte la lucidez en locura para mantener el control?', '32:00', now() - interval '11 days'),
  (9, 'Episodio 9: Miedo - Profunda', 'episodio-9-miedo-profunda-2', '¿Qué imagen de mí me devuelve el diagnóstico que en realidad describe al sistema?', '28:00', now() - interval '10 days'),
  (10, 'Episodio 10: Culpa-Obediencia - Profunda', 'episodio-10-culpa-profunda-2', '¿Por qué mis percepciones válidas son invalidadas como síntomas?', '29:00', now() - interval '9 days'),
  (11, 'Episodio 11: Fatiga-Delegación - Profunda', 'episodio-11-fatiga-profunda', '¿Existe brújula ética cuando hemos sido diseñados para no verla?', '33:00', now() - interval '8 days'),
  (12, 'Episodio 12: Conciencia-Rebelión - Media', 'episodio-12-conciencia-media', '¿La rebelión es un acto consciente o una respuesta involuntaria?', '27:00', now() - interval '7 days'),
  (13, 'Episodio 13: Miedo - Profunda', 'episodio-13-miedo-profunda-3', '¿Qué significa ser libre en un sistema que define la libertad?', '34:00', now() - interval '6 days'),
  (14, 'Episodio 14: Tecnología-Vigilancia - Profunda', 'episodio-14-tecnologia-profunda-2', '¿Cómo distinguir entre mi deseo y el deseo que me fue implantado?', '30:00', now() - interval '5 days'),
  (15, 'Episodio 15: Fatiga-Delegación - Media', 'episodio-15-fatiga-media-2', '¿Es posible la empatía en una estructura de escasez competitiva?', '26:00', now() - interval '4 days', NULL),
  (16, 'Episodio 16: Conciencia-Rebelión - Profunda', 'episodio-16-conciencia-profunda', '¿Qué pasa cuando la voz interna de alerta se vuelve más fuerte que la del sistema?', '35:00', now() - interval '3 days', NULL),
  (17, 'Episodio 17: Culpa-Obediencia - Profunda', 'episodio-17-culpa-profunda-3', '¿Por qué reproducimos el patrón que nos daña?', '28:00', now() - interval '2 days', NULL),
  (18, 'Episodio 18: Tecnología-Vigilancia - Profunda', 'episodio-18-tecnologia-profunda-3', '¿Quién decide quién es "enfermo" y quién "normal" en un sistema enfermo?', '36:00', now() - interval '1 day', NULL)
on conflict (id) do nothing;

-- Insert episode-question relations
insert into public.episode_questions (episode_id, question_id) values
  (1, 'Q01'), (2, 'Q02'), (3, 'Q03'), (4, 'Q04'), (5, 'Q05'),
  (6, 'Q06'), (7, 'Q07'), (8, 'Q08'), (9, 'Q09'), (10, 'Q10'),
  (11, 'Q11'), (12, 'Q12'), (13, 'Q13'), (14, 'Q14'), (15, 'Q15'),
  (16, 'Q16'), (17, 'Q17'), (18, 'Q18')
on conflict do nothing;

-- Insert chapters
insert into public.chapters (id, title, slug, summary, axis_id, dialogue) values
  (1, 'El Despertar del Miedo', 'el-despertar-del-miedo', 'En el principio fue el temblor. El miedo primordial se convierte en el arquitecto invisible de nuestras primeras decisiones.', 'miedo-control', '—¿Y si el miedo no es un enemigo, Sócrates? —Entonces, amigo mío, quizás sea un maestro disfrazado de sombra.'),
  (2, 'La Trampa de la Razón', 'la-trampa-de-la-razon', 'La lógica como prisión dorada. Cuando la mente construye laberintos perfectos que nos alejan de la verdad simple.', 'culpa-obediencia', '—Pero si todo puede explicarse, ¿qué queda por sentir? —La pregunta misma, que ninguna respuesta puede abrazar.'),
  (3, 'La Comedia del Control', 'la-comedia-del-control', 'Reímos para no llorar ante la ilusión del dominio. El ser humano construye imperios de arena convencido de que son montañas.', 'tecnologia-vigilancia', '—Controlamos el fuego, Sócrates. —Y el fuego, a su vez, controla nuestros sueños de grandeza.'),
  (4, 'El Peso de la Culpa', 'el-peso-de-la-culpa', 'Heredamos culpas que no cometimos. La culpa como moneda de cambio en el mercado de las relaciones humanas.', 'fatiga-delegacion', 'El peso invisible que cargamos desde que aprendemos la palabra debería.'),
  (5, 'La Máscara del Héroe', 'la-mascara-del-heroe', 'Todos llevamos máscaras, pero la del héroe es la más pesada. El precio de ser fuerte cuando el alma pide rendición.', 'miedo-control', 'La construcción del yo heroico como defensa ante la vulnerabilidad.')
on conflict (id) do nothing;

-- Commit checkpoint
select count(*) as axes_count from public.axes;
select count(*) as questions_count from public.questions;
select count(*) as episodes_count from public.episodes;
select count(*) as chapters_count from public.chapters;
