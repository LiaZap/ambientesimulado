
import { PrismaClient, Subject, Difficulty } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding PRF 2025 Exam (Edition 2)...')

    // 1. Create the Exam
    const exam = await prisma.exam.create({
        data: {
            title: 'Simulado PRF 2025 - Edição 2 (Completo)',
            description: 'Segundo simulado completo com 120 questões estilo Cebraspe (Certo/Errado), com textos em Inglês e foco em Legislação de Trânsito.',
            totalQuestions: 120,
            duration: 270, // 4h30min
            year: 2025,
            isActive: true,
        }
    })

    console.log(`Exam created with ID: ${exam.id}`)

    // 2. Define Questions
    const questionsData = [
        // BLOCO I
        // Ingles (1-8) -> PORTUGUES (Topic: Língua Inglesa)
        { q: 1, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'According to the text, climate change is affecting transportation infrastructure only in coastal areas.', ans: 'ERRADO' },
        { q: 2, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'The phrase "long-term planning" in the first paragraph refers to strategies that focus exclusively on immediate repairs.', ans: 'ERRADO' },
        { q: 3, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'Dr. Marcus Chen suggests that infrastructure design should consider future climate conditions rather than past weather data.', ans: 'CERTO' },
        { q: 4, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'In "allowing for preventive maintenance rather than reactive repairs", the word "rather" could be replaced by instead of without changing the meaning.', ans: 'CERTO' },
        { q: 5, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'The text implies that embedded sensors in roads serve only to detect traffic violations.', ans: 'ERRADO' },
        { q: 6, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'The word "However" at the beginning of the last paragraph introduces an idea that contrasts with the positive developments mentioned previously.', ans: 'CERTO' },
        { q: 7, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'According to the text, developed countries face greater challenges in climate adaptation than developing nations.', ans: 'ERRADO' },
        { q: 8, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'It can be inferred from the text that global investment in transport infrastructure resilience must increase significantly in the coming decades.', ans: 'CERTO' },

        // Portugues (9-20)
        { q: 9, s: 'PORTUGUES', t: 'Interpretação de Texto', txt: 'Depreende-se do primeiro parágrafo que as rodovias federais são utilizadas por organizações criminosas devido à sua extensão territorial.', ans: 'CERTO' },
        { q: 10, s: 'PORTUGUES', t: 'Gramática', txt: 'A forma verbal "desafiando", no primeiro parágrafo, poderia ser substituída por que desafiam, sem prejuízo da correção gramatical.', ans: 'CERTO' },
        { q: 11, s: 'PORTUGUES', t: 'Coesão', txt: 'O pronome "suas", em "suas atividades ilícitas", refere-se a "organizações criminosas".', ans: 'CERTO' },
        { q: 12, s: 'PORTUGUES', t: 'Semântica', txt: 'A expressão "tecnologia de ponta", no segundo parágrafo, pode ser substituída por tecnologia avançada, mantendo-se o sentido original.', ans: 'CERTO' },
        { q: 13, s: 'PORTUGUES', t: 'Conjunções', txt: 'No trecho "Além disso, a capacitação constante dos agentes", o conectivo "Além disso" estabelece relação de oposição.', ans: 'ERRADO' },
        { q: 14, s: 'PORTUGUES', t: 'Concordância', txt: 'A correção gramatical seria mantida caso o trecho "ampliam a efetividade das operações" fosse reescrito como: amplia a efetividade das operações.', ans: 'ERRADO' },
        { q: 15, s: 'PORTUGUES', t: 'Conjunções', txt: 'O vocábulo "Entretanto", que inicia o terceiro parágrafo, introduz uma ideia de contraste em relação ao parágrafo anterior.', ans: 'CERTO' },
        { q: 16, s: 'PORTUGUES', t: 'Crase', txt: 'No trecho "exige vigilância permanente", o acento indicativo de crase seria facultativo caso fosse empregada a expressão "à vigilância permanente".', ans: 'ERRADO' },
        { q: 17, s: 'PORTUGUES', t: 'Coesão', txt: 'A expressão "Por fim", no último parágrafo, poderia ser substituída por Finalmente, sem alteração de sentido.', ans: 'CERTO' },
        { q: 18, s: 'PORTUGUES', t: 'Sintaxe', txt: 'O sujeito da forma verbal "constitui", no último parágrafo, é "a participação da sociedade civil".', ans: 'CERTO' },
        { q: 19, s: 'PORTUGUES', t: 'Pontuação', txt: 'A supressão da vírgula empregada após "prestadas" alteraria o sentido do último período do texto.', ans: 'ERRADO' },
        { q: 20, s: 'PORTUGUES', t: 'Interpretação', txt: 'Infere-se do texto que o enfrentamento à criminalidade nas rodovias depende exclusivamente da atuação da PRF.', ans: 'ERRADO' },

        // Redação Oficial (21-26)
        { q: 21, s: 'PORTUGUES', t: 'Redação Oficial', txt: 'A uniformidade na comunicação oficial garante que os documentos expedidos por diferentes órgãos sigam padrões semelhantes de formatação e linguagem.', ans: 'CERTO' },
        { q: 22, s: 'PORTUGUES', t: 'Redação Oficial', txt: 'O fecho "Respeitosamente" é adequado para comunicações dirigidas a autoridades de mesma hierarquia ou de hierarquia inferior.', ans: 'ERRADO' },
        { q: 23, s: 'PORTUGUES', t: 'Redação Oficial', txt: 'A redação oficial admite o uso de linguagem coloquial em documentos internos de menor formalidade.', ans: 'ERRADO' },
        { q: 24, s: 'PORTUGUES', t: 'Redação Oficial', txt: 'O vocativo nas comunicações oficiais deve ser seguido de vírgula, conforme estabelece o MRPR.', ans: 'CERTO' },
        { q: 25, s: 'PORTUGUES', t: 'Redação Oficial', txt: 'A identificação do signatário deve conter o nome completo e o cargo da autoridade que subscreve o documento.', ans: 'CERTO' },
        { q: 26, s: 'PORTUGUES', t: 'Redação Oficial', txt: 'Os pronomes de tratamento "Vossa Excelência" e "Sua Excelência" são utilizados indistintamente para referência direta e indireta à autoridade.', ans: 'ERRADO' },

        // RLM (27-32)
        { q: 27, s: 'RACIOCINIO_LOGICO', t: 'Progressão Aritmética', txt: 'A razão da progressão aritmética formada pela quantidade de apreensões é igual a 6.', ans: 'CERTO' },
        { q: 28, s: 'RACIOCINIO_LOGICO', t: 'Progressão Aritmética', txt: 'No sétimo dia da operação, foram realizadas mais de 45 apreensões.', ans: 'ERRADO' },
        { q: 29, s: 'RACIOCINIO_LOGICO', t: 'Soma de PA', txt: 'A soma total de apreensões nos primeiros cinco dias da operação foi igual a 70.', ans: 'CERTO' },
        { q: 30, s: 'RACIOCINIO_LOGICO', t: 'Soma de PA', txt: 'Se a operação durasse 10 dias, mantendo-se o padrão, seriam realizadas mais de 350 apreensões no total.', ans: 'CERTO' },
        { q: 31, s: 'RACIOCINIO_LOGICO', t: 'Probabilidade', txt: 'A probabilidade de nenhum dos 4 veículos apresentar irregularidade é superior a 50%.', ans: 'CERTO' },
        { q: 32, s: 'RACIOCINIO_LOGICO', t: 'Probabilidade', txt: 'A probabilidade de pelo menos um veículo apresentar irregularidade é inferior a 40%.', ans: 'ERRADO' },

        // Informática (33-39)
        { q: 33, s: 'INFORMATICA', t: 'Redes', txt: 'O protocolo TCP/IP é responsável por garantir que os dados sejam transmitidos de forma confiável entre dispositivos em uma rede.', ans: 'CERTO' },
        { q: 34, s: 'INFORMATICA', t: 'Segurança', txt: 'Um certificado digital serve para comprovar a identidade de pessoas, empresas ou servidores na internet, garantindo a autenticidade das comunicações.', ans: 'CERTO' },
        { q: 35, s: 'INFORMATICA', t: 'Segurança', txt: 'Spyware é um tipo de software malicioso que se replica automaticamente, espalhando-se para outros computadores sem interação do usuário.', ans: 'ERRADO' },
        { q: 36, s: 'INFORMATICA', t: 'Criptografia', txt: 'A criptografia de ponta a ponta garante que apenas o remetente e o destinatário possam ler as mensagens trocadas.', ans: 'CERTO' },
        { q: 37, s: 'INFORMATICA', t: 'VPN', txt: 'VPN (Virtual Private Network) é uma tecnologia que permite criar uma conexão segura sobre uma rede pública, como a internet.', ans: 'CERTO' },
        { q: 38, s: 'INFORMATICA', t: 'Windows', txt: 'No Windows, a ferramenta BitLocker permite criptografar unidades de disco para proteger dados contra acesso não autorizado.', ans: 'CERTO' },
        { q: 39, s: 'INFORMATICA', t: 'Internet', txt: 'Cookies são arquivos de texto armazenados no servidor web que contêm informações sobre as preferências de navegação do usuário.', ans: 'ERRADO' },

        // Física (40-44)
        { q: 40, s: 'FISICA', t: 'Cinemática', txt: 'A desaceleração do caminhão durante a frenagem foi de 2 m/s².', ans: 'CERTO' },
        { q: 41, s: 'FISICA', t: 'Energia', txt: 'A energia cinética inicial do caminhão era de 1.600.000 J.', ans: 'CERTO' },
        { q: 42, s: 'FISICA', t: 'Energia', txt: 'A variação da energia cinética durante a frenagem foi de 1.200.000 J em módulo.', ans: 'CERTO' },
        { q: 43, s: 'FISICA', t: 'Impulso', txt: 'O impulso da força resultante sobre o caminhão durante a frenagem foi de 80.000 N.s em módulo.', ans: 'CERTO' },
        { q: 44, s: 'FISICA', t: 'Dinâmica', txt: 'Se o caminhão estivesse em uma curva circular de raio 100 m com velocidade de 54 km/h, a força centrípeta seria de 18.000 N.', ans: 'CERTO' },

        // Ética (45-50)
        { q: 45, s: 'ETICA', t: 'Ética', txt: 'O servidor público deve exercer suas atribuições com rapidez, perfeição e rendimento, colocando o interesse público acima dos interesses pessoais.', ans: 'CERTO' },
        { q: 46, s: 'ETICA', t: 'Código de Ética', txt: 'Segundo o Código de Ética, é vedado ao servidor público utilizar-se do cargo para obter qualquer favorecimento para si ou para outrem.', ans: 'CERTO' },
        { q: 47, s: 'ETICA', t: 'Código de Ética', txt: 'A cortesia no atendimento ao público é uma recomendação opcional, cabendo ao servidor avaliá-la conforme a situação.', ans: 'ERRADO' },
        { q: 48, s: 'ETICA', t: 'Princípios', txt: 'O princípio da eficiência impõe ao servidor o dever de buscar os melhores resultados com o menor dispêndio de recursos públicos.', ans: 'CERTO' },
        { q: 49, s: 'ETICA', t: 'Comissão de Ética', txt: 'A comissão de ética pode aplicar ao servidor infrator a pena de censura, que será registrada em seus assentamentos funcionais.', ans: 'CERTO' },
        { q: 50, s: 'ETICA', t: 'Proibições', txt: 'O servidor público pode exercer advocacia junto à repartição onde trabalha, desde que em causas de interesse próprio.', ans: 'ERRADO' },

        // Geopolítica (51-55) -> NOCOES_CIDADANIA
        { q: 51, s: 'NOCOES_CIDADANIA', t: 'Transportes', txt: 'A malha rodoviária federal brasileira conecta todas as capitais estaduais, sendo fundamental para a integração nacional.', ans: 'CERTO' },
        { q: 52, s: 'NOCOES_CIDADANIA', t: 'Transportes', txt: 'O modal ferroviário é o principal meio de transporte de cargas no Brasil, superando o rodoviário em volume transportado.', ans: 'ERRADO' },
        { q: 53, s: 'NOCOES_CIDADANIA', t: 'Rede Urbana', txt: 'A concentração da rede urbana brasileira nas regiões litorâneas reflete o processo histórico de ocupação do território.', ans: 'CERTO' },
        { q: 54, s: 'NOCOES_CIDADANIA', t: 'Rede Urbana', txt: 'São Paulo é classificada como Grande Metrópole Nacional, exercendo influência sobre todo o território brasileiro.', ans: 'CERTO' },
        { q: 55, s: 'NOCOES_CIDADANIA', t: 'Rede Urbana', txt: 'A hierarquia urbana brasileira é estabelecida exclusivamente pelo número de habitantes de cada município.', ans: 'ERRADO' },

        // BLOCO II - Trânsito (56-85)
        { q: 56, s: 'LEGISLACAO_TRANSITO', t: 'Velocidade', txt: 'O limite de velocidade para automóveis em rodovias de pista simples, na ausência de sinalização, é de 100 km/h.', ans: 'ERRADO' }, // 56 E
        { q: 57, s: 'LEGISLACAO_TRANSITO', t: 'Habilitação', txt: 'A carteira nacional de habilitação é documento obrigatório para a condução de veículo automotor, devendo ser portada pelo condutor ou estar disponível em meio digital.', ans: 'CERTO' },
        { q: 58, s: 'LEGISLACAO_TRANSITO', t: 'Crimes/Infrações', txt: 'O condutor que se recusar a submeter-se ao teste de alcoolemia está sujeito às mesmas penalidades aplicadas ao condutor alcoolizado.', ans: 'CERTO' },
        { q: 59, s: 'LEGISLACAO_TRANSITO', t: 'Veículos', txt: 'Veículo com defeito em sistema de iluminação está proibido de circular, devendo ser rebocado até o local de reparo.', ans: 'ERRADO' },
        { q: 60, s: 'LEGISLACAO_TRANSITO', t: 'Infrações', txt: 'Em caso de acidente de trânsito sem vítimas, os condutores devem aguardar a chegada da autoridade policial antes de remover os veículos da pista.', ans: 'ERRADO' },
        { q: 61, s: 'LEGISLACAO_TRANSITO', t: 'Fiscalização', txt: 'Os equipamentos medidores de velocidade devem estar devidamente aferidos e homologados pelo INMETRO.', ans: 'CERTO' },
        { q: 62, s: 'LEGISLACAO_TRANSITO', t: 'AET', txt: 'A autorização especial de trânsito para veículos ou combinações de veículos de carga que não se enquadrem nos limites de peso e dimensões deve ser emitida pelo DENATRAN.', ans: 'ERRADO' },
        { q: 63, s: 'LEGISLACAO_TRANSITO', t: 'Equipamentos', txt: 'O uso do cinto de segurança é obrigatório para todos os ocupantes do veículo, inclusive nos bancos traseiros.', ans: 'CERTO' },
        { q: 64, s: 'LEGISLACAO_TRANSITO', t: 'Cadeirinha', txt: 'A cadeirinha de segurança para transporte de crianças é obrigatória até os sete anos de idade.', ans: 'ERRADO' },
        { q: 65, s: 'LEGISLACAO_TRANSITO', t: 'Equipamentos', txt: 'A película nos vidros laterais traseiros pode ter índice de transmissão luminosa inferior ao mínimo exigido para os vidros dianteiros.', ans: 'CERTO' },
        { q: 66, s: 'LEGISLACAO_TRANSITO', t: 'Veículos Emergência', txt: 'Os veículos de emergência têm prioridade de passagem quando em serviço de urgência, devendo os demais condutores facilitar sua passagem.', ans: 'CERTO' },
        { q: 67, s: 'LEGISLACAO_TRANSITO', t: 'Infrações', txt: 'A infração de natureza média resulta em cinco pontos na carteira de habilitação do condutor infrator.', ans: 'ERRADO' }, // Media is 4. Grave is 5.
        { q: 68, s: 'LEGISLACAO_TRANSITO', t: 'PNATRANS', txt: 'O Plano Nacional de Redução de Mortes e Lesões no Trânsito (PNATRANS) estabelece meta de redução de 50% no número de mortes até 2028.', ans: 'CERTO' },
        { q: 69, s: 'LEGISLACAO_TRANSITO', t: 'Transporte Crianças', txt: 'É proibido o transporte de crianças menores de dez anos no banco dianteiro do veículo.', ans: 'CERTO' }, // Rule changed? 10 years.
        { q: 70, s: 'LEGISLACAO_TRANSITO', t: 'Processo Administrativo', txt: 'O condutor autuado tem prazo de quinze dias para apresentar defesa prévia à autoridade de trânsito.', ans: 'ERRADO' }, // 30 days now.
        { q: 71, s: 'LEGISLACAO_TRANSITO', t: 'Tacógrafo', txt: 'O tacógrafo é equipamento obrigatório em veículos de transporte de carga com peso bruto total superior a 4.536 kg.', ans: 'CERTO' },
        { q: 72, s: 'LEGISLACAO_TRANSITO', t: 'Tacógrafo', txt: 'O disco diagrama deve ser preenchido pelo condutor com seus dados de identificação antes do início da jornada.', ans: 'CERTO' },
        { q: 73, s: 'LEGISLACAO_TRANSITO', t: 'Tacógrafo', txt: 'A responsabilidade pela manutenção e calibração periódica do tacógrafo é do proprietário do veículo.', ans: 'CERTO' },
        { q: 74, s: 'LEGISLACAO_TRANSITO', t: 'Pesos e Dimensões', txt: 'O peso máximo por eixo simples de rodagem simples é de 6 toneladas.', ans: 'ERRADO' },
        { q: 75, s: 'LEGISLACAO_TRANSITO', t: 'Pesos e Dimensões', txt: 'A largura máxima permitida para veículos em circulação é de 2,60 metros.', ans: 'CERTO' },
        { q: 76, s: 'LEGISLACAO_TRANSITO', t: 'Pesos e Dimensões', txt: 'O comprimento máximo para veículos articulados do tipo cavalo mecânico mais semirreboque é de 18,15 metros.', ans: 'CERTO' }, // 18,60 often, but let's trust Gabarito 76 C. 18.15 might be a specific limit in the text context or specific vehicle type.
        { q: 77, s: 'LEGISLACAO_TRANSITO', t: 'Motorista Profissional', txt: 'O motorista profissional deve fazer uma pausa de, no mínimo, 30 minutos a cada 5 horas e meia de direção ininterrupta.', ans: 'ERRADO' },
        { q: 78, s: 'LEGISLACAO_TRANSITO', t: 'Motorista Profissional', txt: 'O intervalo interjornadas do motorista profissional é de, no mínimo, 11 horas de descanso.', ans: 'CERTO' },
        { q: 79, s: 'LEGISLACAO_TRANSITO', t: 'Motorista Profissional', txt: 'A jornada diária de trabalho do motorista profissional não pode exceder 8 horas, vedada qualquer prorrogação.', ans: 'ERRADO' },
        { q: 80, s: 'LEGISLACAO_TRANSITO', t: 'Balança', txt: 'A tolerância para excesso de peso bruto total do veículo é de 5% sobre o limite regulamentar.', ans: 'CERTO' },
        { q: 81, s: 'LEGISLACAO_TRANSITO', t: 'Balança', txt: 'O veículo autuado por excesso de peso pode prosseguir viagem após o pagamento da multa, independentemente da regularização da carga.', ans: 'ERRADO' },
        { q: 82, s: 'LEGISLACAO_TRANSITO', t: 'Educação', txt: 'O Maio Amarelo é uma campanha educativa de trânsito realizada anualmente com foco na conscientização sobre segurança viária.', ans: 'CERTO' },
        { q: 83, s: 'LEGISLACAO_TRANSITO', t: 'Cargas', txt: 'A carga transportada deve estar devidamente amarrada e fixada de modo a impedir seu deslocamento durante o trajeto.', ans: 'CERTO' },
        { q: 84, s: 'LEGISLACAO_TRANSITO', t: 'Cargas', txt: 'É permitido o transporte de carga solta na carroceria desde que não ultrapasse os limites laterais do veículo.', ans: 'ERRADO' },
        { q: 85, s: 'LEGISLACAO_TRANSITO', t: 'Cargas', txt: 'Os dispositivos de fixação devem ter resistência compatível com o peso e as características da carga transportada.', ans: 'CERTO' },

        // BLOCO III (86-120)
        { q: 86, s: 'DIREITO_ADMINISTRATIVO', t: 'Poder de Polícia', txt: 'O ato do policial caracteriza exercício do poder de polícia administrativa.', ans: 'CERTO' },
        { q: 87, s: 'DIREITO_ADMINISTRATIVO', t: 'Atos Administrativos', txt: 'A remoção do veículo constitui medida administrativa autoexecutória.', ans: 'CERTO' },
        { q: 88, s: 'DIREITO_ADMINISTRATIVO', t: 'Responsabilidade', txt: 'O desconhecimento alegado pelo condutor afasta a responsabilidade pela infração cometida.', ans: 'ERRADO' },
        { q: 89, s: 'DIREITO_ADMINISTRATIVO', t: 'Legalidade', txt: 'O princípio da legalidade impede o agente de aplicar penalidade diversa da prevista em lei.', ans: 'CERTO' },
        { q: 90, s: 'DIREITO_ADMINISTRATIVO', t: 'Penalidades', txt: 'A advertência solicitada pelo condutor é sanção administrativa prevista no CTB para a infração em questão.', ans: 'ERRADO' },
        { q: 91, s: 'DIREITO_ADMINISTRATIVO', t: 'Carreira PRF', txt: 'O ingresso na carreira de PRF ocorre mediante concurso público de provas, vedada a exigência de título.', ans: 'ERRADO' },
        { q: 92, s: 'DIREITO_ADMINISTRATIVO', t: 'Atribuições', txt: 'Entre as atribuições do policial rodoviário federal está a fiscalização do cumprimento da legislação de trânsito nas rodovias e estradas federais.', ans: 'CERTO' },
        { q: 93, s: 'DIREITO_CONSTITUCIONAL', t: 'Direitos Fundamentais', txt: 'A liberdade de locomoção no território nacional é assegurada a todos, inclusive estrangeiros, em tempo de paz.', ans: 'CERTO' },
        { q: 94, s: 'DIREITO_CONSTITUCIONAL', t: 'Inviolabilidade Domicílio', txt: 'A casa é asilo inviolável do indivíduo, podendo nela ser realizada busca e apreensão durante o dia, desde que autorizada judicialmente.', ans: 'CERTO' },
        { q: 95, s: 'DIREITO_CONSTITUCIONAL', t: 'Extradição', txt: 'O brasileiro nato não pode ser extraditado em nenhuma hipótese.', ans: 'CERTO' },
        { q: 96, s: 'DIREITO_CONSTITUCIONAL', t: 'Remédios', txt: 'O mandado de segurança é o remédio constitucional adequado para proteger direito líquido e certo não amparado por habeas corpus ou habeas data.', ans: 'CERTO' },
        { q: 97, s: 'DIREITO_CONSTITUCIONAL', t: 'Direitos do Preso', txt: 'É garantido ao preso o direito de permanecer calado, sendo-lhe assegurada a assistência de advogado.', ans: 'CERTO' },
        { q: 98, s: 'DIREITO_CONSTITUCIONAL', t: 'Estado de Defesa', txt: 'O estado de defesa pode ser decretado pelo Presidente da República, ouvidos o Conselho da República e o Conselho de Defesa Nacional.', ans: 'CERTO' },
        { q: 99, s: 'DIREITO_CONSTITUCIONAL', t: 'Segurança Pública', txt: 'A Polícia Rodoviária Federal é órgão permanente do sistema de segurança pública, estruturado em carreira.', ans: 'CERTO' },
        { q: 100, s: 'DIREITO_PENAL', t: 'Crimes de Trânsito', txt: 'A recusa ao teste do etilômetro impede a caracterização do crime de embriaguez ao volante.', ans: 'ERRADO' },
        { q: 101, s: 'DIREITO_PENAL', t: 'Provas', txt: 'Os sinais clínicos de embriaguez podem ser utilizados como prova para a lavratura do auto de infração.', ans: 'CERTO' },
        { q: 102, s: 'DIREITO_PENAL', t: 'Crimes de Trânsito', txt: 'O crime de embriaguez ao volante é de perigo abstrato, não exigindo comprovação de risco efetivo.', ans: 'CERTO' },
        { q: 103, s: 'DIREITO_PENAL', t: 'Prisão', txt: 'A condução do motorista à delegacia caracteriza prisão em flagrante na modalidade própria.', ans: 'ERRADO' }, // Gabarito 103 E.
        { q: 104, s: 'LEGISLACAO_TRANSITO', t: 'Infrações', txt: 'A recusa ao teste do etilômetro configura infração administrativa autônoma, com penalidade própria.', ans: 'CERTO' },
        { q: 105, s: 'DIREITO_PENAL', t: 'Busca e Apreensão', txt: 'A busca no veículo em via pública dispensa mandado judicial.', ans: 'CERTO' },
        { q: 106, s: 'DIREITO_PENAL', t: 'Crimes', txt: 'A conduta do motorista configura tráfico internacional de drogas.', ans: 'CERTO' },
        { q: 107, s: 'DIREITO_PENAL', t: 'Competência', txt: 'O crime praticado é de competência da Justiça Federal.', ans: 'CERTO' },
        { q: 108, s: 'DIREITO_PENAL', t: 'Provas', txt: 'A confissão do condutor, por si só, é elemento suficiente para embasar sua condenação.', ans: 'ERRADO' },
        { q: 109, s: 'DIREITO_PENAL', t: 'Perdimento', txt: 'O veículo utilizado no transporte da droga pode ser objeto de perdimento em favor da União.', ans: 'CERTO' },
        { q: 110, s: 'DIREITO_PENAL', t: 'Armas', txt: 'O porte ilegal de arma de fogo de uso restrito constitui crime inafiançável.', ans: 'CERTO' },
        { q: 111, s: 'DIREITO_PENAL', t: 'Tortura', txt: 'A prática de tortura por agente público é causa de aumento de pena.', ans: 'CERTO' },
        { q: 112, s: 'DIREITO_PENAL', t: 'Identificação', txt: 'A identificação criminal pode ser realizada quando o documento apresentado estiver rasurado ou contiver indício de falsificação.', ans: 'CERTO' },
        { q: 113, s: 'DIREITO_PENAL', t: 'Hediondos', txt: 'O homicídio qualificado é classificado como crime hediondo.', ans: 'CERTO' },
        { q: 114, s: 'DIREITO_PENAL', t: 'Drogas', txt: 'A Lei de Drogas prevê a possibilidade de o usuário de substância entorpecente ser submetido a medidas educativas, como advertência sobre os efeitos das drogas.', ans: 'CERTO' },
        { q: 115, s: 'DIREITO_PENAL', t: 'Drogas', txt: 'O crime de tráfico de drogas é insuscetível de fiança e de graça ou anistia.', ans: 'CERTO' },
        { q: 116, s: 'DIREITO_CONSTITUCIONAL', t: 'Direitos Humanos', txt: 'Os tratados internacionais de direitos humanos aprovados em cada Casa do Congresso Nacional, em dois turnos, por três quintos dos votos, equivalem às emendas constitucionais.', ans: 'CERTO' },
        { q: 117, s: 'DIREITO_CONSTITUCIONAL', t: 'Direitos Humanos', txt: 'A prisão civil por dívida é vedada no Brasil, salvo a do responsável pelo inadimplemento voluntário e inescusável de obrigação alimentícia.', ans: 'CERTO' }, // 117 C. (Standard law also includes depositario infiel exception in constitution text but STF overruled it. The item reflects current interpretation. Gabarito C).
        { q: 118, s: 'DIREITO_CONSTITUCIONAL', t: 'Direitos Humanos', txt: 'O princípio da presunção de inocência garante que ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória.', ans: 'CERTO' },
        { q: 119, s: 'DIREITO_CONSTITUCIONAL', t: 'Direitos Humanos', txt: 'Segundo o STF, a execução provisória da pena após condenação em segunda instância não viola o princípio da presunção de inocência.', ans: 'ERRADO' }, // 119 E. (Lula case changed this back to C. The item says "does NOT violate", thus False currently. Gabarito E).
        { q: 120, s: 'DIREITO_CONSTITUCIONAL', t: 'Direitos Humanos', txt: 'A Convenção Americana de Direitos Humanos estabelece que toda pessoa tem direito a um recurso simples e rápido perante os juízes ou tribunais competentes.', ans: 'CERTO' },
    ]

    // 3. Insert Questions and Connect to Exam
    console.log(`Inserting ${questionsData.length} questions...`)

    for (const q of questionsData) {
        const question = await prisma.question.create({
            data: {
                statement: q.txt,
                subject: q.s as Subject,
                topic: q.t,
                difficulty: 'MEDIUM', // Default
                correctAnswer: q.ans,
                institution: 'Cebraspe',
                year: 2025,
                options: { "C": "CERTO", "E": "ERRADO" }, // C/E Format
            }
        })

        // Connect to Exam
        await prisma.exam.update({
            where: { id: exam.id },
            data: {
                questions: {
                    connect: { id: question.id }
                }
            }
        })
    }

    console.log('Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
