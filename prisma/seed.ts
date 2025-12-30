import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Start seeding...')

    // 1. CLEANUP (Prevent Duplicates)
    console.log('🧹 Cleaning up old data...')
    try {
        await prisma.answer.deleteMany({})
        await prisma.question.deleteMany({})
        await prisma.examAttempt.deleteMany({})
        await prisma.exam.deleteMany({})
        console.log('✨ Old data cleared.')
    } catch (e) {
        console.warn('⚠️  Could not clear some data (maybe cascade issues), proceeding...')
    }

    // 2. Create/Update Admin User
    const passwordHash = await bcrypt.hash('123456', 10)

    // Default Admin (Keep or generic)
    await prisma.user.upsert({
        where: { email: 'admin@prf.gov.br' },
        update: { role: 'ADMIN' },
        create: {
            email: 'admin@prf.gov.br',
            name: 'Admin PRF',
            password: passwordHash,
            role: 'ADMIN',
            profile: { create: { level: 99, xp: 99999, rank: 'Comandante', streak: 99 } }
        }
    })

    // Requested Admin: Angelo
    await prisma.user.upsert({
        where: { email: 'angeloamps013@gmail.com' },
        update: {
            role: 'ADMIN',
            password: passwordHash // Force password reset on update
        },
        create: {
            email: 'angeloamps013@gmail.com',
            name: 'Angelo Admin',
            password: passwordHash,
            role: 'ADMIN',
            profile: { create: { level: 50, xp: 50000, rank: 'Inspetor', streak: 10 } }
        }
    })
    console.log('👤 Admin user created/updated: angeloamps013@gmail.com')

    // Requested Super Admin: Paulo
    await prisma.user.upsert({
        where: { email: 'contatopaulonvr@gmail.com' },
        update: {
            role: 'SUPER_ADMIN',
            password: passwordHash // Force password reset on update
        },
        create: {
            email: 'contatopaulonvr@gmail.com',
            name: 'Paulo SuperAdmin',
            password: passwordHash,
            role: 'SUPER_ADMIN',
            profile: { create: { level: 100, xp: 100000, rank: 'Diretor Geral', streak: 100 } }
        }
    })
    console.log('👤 Super Admin user created/updated: contatopaulonvr@gmail.com')

    // --- USERS & COURSES (Base Data) ---
    // Create initial subjects
    const subjects = [
        'PORTUGUES',
        'DIREITO_CONSTITUCIONAL',
        'DIREITO_ADMINISTRATIVO',
        'DIREITO_PENAL',
        'LEGISLACAO_TRANSITO',
        'FISICA',
        'RACIOCINIO_LOGICO',
        'INFORMATICA',
        'ETICA',
        'NOCOES_CIDADANIA',
    ]

    // Create a Course for each subject
    for (const subject of subjects) {
        const course = await prisma.course.upsert({
            where: { id: `course-${subject.toLowerCase()}` },
            update: {},
            create: {
                id: `course-${subject.toLowerCase()}`,
                title: `Curso Completo de ${subject.replace('_', ' ')}`,
                description: `Módulos abrangentes para dominar ${subject.replace('_', ' ')} na PRF.`,
                subject: subject as any,
                order: subjects.indexOf(subject) + 1,
                isActive: true,
            }
        })
    }

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10)
    const userExists = await prisma.user.findUnique({ where: { email: 'test@example.com' } })

    if (!userExists) {
        await prisma.user.create({
            data: {
                email: 'test@example.com',
                name: 'Test Student',
                password: hashedPassword,
                role: 'PREMIUM',
                profile: {
                    create: {
                        level: 5,
                        xp: 1250,
                        rank: 'Aspirante',
                        streak: 3
                    }
                }
            }
        })
        console.log('👤 User created.')
    }

    // --- QUESTIONS DATA (Extracted from 2025-3 Script) ---
    const questionsData = [
        // BLOCO I
        // Ingles (1-8)
        { q: 1, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'According to the text, criminal organizations use only commercial shipping methods to transport illegal drugs.', ans: 'ERRADO' },
        { q: 2, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'The word "sophisticated" in the first paragraph could be replaced by complex without changing the meaning of the sentence.', ans: 'CERTO' },
        { q: 3, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'Maria Santos suggests that fighting drug trafficking requires countries to work together.', ans: 'CERTO' },
        { q: 4, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'In the phrase "No single country can address this problem alone", the word "address" means to speak to.', ans: 'ERRADO' },
        { q: 5, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'The text states that detection technologies have completely eliminated the ability of traffickers to conceal drugs.', ans: 'ERRADO' },
        { q: 6, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'The word "Nevertheless" in the third paragraph introduces an idea of contrast.', ans: 'CERTO' },
        { q: 7, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'According to the text, the negative effects of drug trafficking are limited to law enforcement costs.', ans: 'ERRADO' },
        { q: 8, s: 'PORTUGUES', t: 'Língua Inglesa', txt: 'It can be inferred from the text that the global cost of illegal drug use is substantial.', ans: 'CERTO' },
        // Portugues (9-20)
        { q: 9, s: 'PORTUGUES', t: 'Interpretação de Texto', txt: 'Infere-se do primeiro parágrafo que a fiscalização nas rodovias federais contribui para a segurança pública.', ans: 'CERTO' },
        { q: 10, s: 'PORTUGUES', t: 'Reescrita', txt: 'A expressão "no exercício de suas atribuições" poderia ser substituída por quando exercem suas funções, mantendo-se a correção gramatical e o sentido original.', ans: 'CERTO' },
        { q: 11, s: 'PORTUGUES', t: 'Coesão', txt: 'O pronome "suas", em "suas atribuições", refere-se a "rodovias federais brasileiras".', ans: 'ERRADO' },
        { q: 12, s: 'PORTUGUES', t: 'Coesão', txt: 'No segundo parágrafo, a expressão "Dessa forma" estabelece relação de consequência com o período anterior.', ans: 'CERTO' },
        { q: 13, s: 'PORTUGUES', t: 'Verbos', txt: 'A locução verbal "tem se mostrado" poderia ser reescrita como tem-se mostrado, sem prejuízo da correção gramatical.', ans: 'CERTO' },
        { q: 14, s: 'PORTUGUES', t: 'Sintaxe', txt: 'No trecho "permitem a identificação de rotas", o sujeito da forma verbal "permitem" é composto.', ans: 'CERTO' },
        { q: 15, s: 'PORTUGUES', t: 'Semântica', txt: 'A expressão "atenção redobrada", no terceiro parágrafo, significa atenção duplicada ou intensificada.', ans: 'CERTO' },
        { q: 16, s: 'PORTUGUES', t: 'Concordância', txt: 'A substituição de "potencializa" por potencializam manteria a correção gramatical do período.', ans: 'ERRADO' },
        { q: 17, s: 'PORTUGUES', t: 'Conjunções', txt: 'O vocábulo "Apesar", que inicia o último parágrafo, poderia ser substituído por Embora, desde que feitos os ajustes necessários no restante do período.', ans: 'CERTO' },
        { q: 18, s: 'PORTUGUES', t: 'Crase', txt: 'No trecho "exige constante atualização das técnicas", o acento indicativo de crase seria facultativo caso se escrevesse "à constante atualização".', ans: 'ERRADO' },
        { q: 19, s: 'PORTUGUES', t: 'Semântica', txt: 'O termo "imperativos", no último período do texto, tem sentido de obrigatórios ou indispensáveis.', ans: 'CERTO' },
        { q: 20, s: 'PORTUGUES', t: 'Interpretação', txt: 'Depreende-se do texto que o combate ao narcotráfico nas rodovias federais depende exclusivamente do trabalho da PRF.', ans: 'ERRADO' },
        // Redação Oficial (21-26)
        { q: 21, s: 'PORTUGUES', t: 'Redação Oficial', txt: 'A impessoalidade é característica da redação oficial que impõe ao redator o dever de evitar impressões individuais na elaboração do documento.', ans: 'CERTO' },
        { q: 22, s: 'PORTUGUES', t: 'Redação Oficial', txt: 'O e-mail institucional, quando utilizado para comunicações oficiais, possui valor documental equivalente ao dos demais expedientes.', ans: 'CERTO' },
        { q: 23, s: 'PORTUGUES', t: 'Redação Oficial', txt: 'O uso de siglas na redação oficial é permitido sem qualquer restrição, cabendo ao destinatário conhecer seu significado.', ans: 'ERRADO' },
        { q: 24, s: 'PORTUGUES', t: 'Redação Oficial', txt: 'O fecho "Atenciosamente" é adequado para comunicações dirigidas a autoridades de hierarquia superior.', ans: 'ERRADO' },
        { q: 25, s: 'PORTUGUES', t: 'Redação Oficial', txt: 'A data do documento deve ser escrita por extenso, com alinhamento à direita.', ans: 'ERRADO' },
        { q: 26, s: 'PORTUGUES', t: 'Redação Oficial', txt: 'Nas comunicações oficiais, o texto deve ser formatado com fonte Times New Roman, tamanho 12, conforme determina o MRPR.', ans: 'ERRADO' },
        // RLM (27-32)
        { q: 27, s: 'RACIOCINIO_LOGICO', t: 'Progressão Aritmética', txt: 'A razão da progressão aritmética é igual a 7.', ans: 'CERTO' },
        { q: 28, s: 'RACIOCINIO_LOGICO', t: 'Progressão Aritmética', txt: 'No sétimo dia da operação, foram apreendidos mais de 50 kg de entorpecentes.', ans: 'ERRADO' },
        { q: 29, s: 'RACIOCINIO_LOGICO', t: 'Soma de PA', txt: 'A soma total de entorpecentes apreendidos nos sete dias foi superior a 200 kg.', ans: 'CERTO' },
        { q: 30, s: 'RACIOCINIO_LOGICO', t: 'Sequências', txt: 'O quinto termo da sequência é igual a 40 kg.', ans: 'CERTO' },
        { q: 31, s: 'RACIOCINIO_LOGICO', t: 'Probabilidade', txt: 'A probabilidade de os três veículos estarem regulares é superior a 40%.', ans: 'CERTO' },
        { q: 32, s: 'RACIOCINIO_LOGICO', t: 'Probabilidade', txt: 'A probabilidade de pelo menos um veículo transportar mercadoria irregular é inferior a 55%.', ans: 'ERRADO' },
        // Informática (33-42)
        { q: 33, s: 'INFORMATICA', t: 'Internet/Protocolos', txt: 'O protocolo SSL/TLS é utilizado para estabelecer conexões seguras na internet, criptografando os dados transmitidos entre cliente e servidor.', ans: 'CERTO' },
        { q: 34, s: 'INFORMATICA', t: 'Internet/Intranet', txt: 'Uma intranet utiliza os mesmos protocolos da internet, porém com acesso restrito aos membros de uma organização.', ans: 'CERTO' },
        { q: 35, s: 'INFORMATICA', t: 'Segurança', txt: 'Worm é um tipo de malware que necessita de um programa hospedeiro para se propagar pela rede.', ans: 'ERRADO' },
        { q: 36, s: 'INFORMATICA', t: 'Segurança', txt: 'O Windows Defender Firewall monitora o tráfego de rede e pode bloquear conexões de entrada e de saída consideradas suspeitas.', ans: 'CERTO' },
        { q: 37, s: 'INFORMATICA', t: 'Segurança', txt: 'Engenharia social é uma técnica utilizada por criminosos para obter informações confidenciais por meio da manipulação psicológica das vítimas.', ans: 'CERTO' },
        { q: 38, s: 'INFORMATICA', t: 'Backup', txt: 'O backup diferencial copia apenas os arquivos que foram modificados desde o último backup completo.', ans: 'CERTO' },
        { q: 39, s: 'INFORMATICA', t: 'Segurança', txt: 'A assinatura digital garante apenas a autenticidade do documento, não sendo capaz de verificar sua integridade.', ans: 'ERRADO' },
        { q: 40, s: 'INFORMATICA', t: 'Big Data', txt: 'Big data refere-se ao processamento e análise de grandes volumes de dados estruturados e não estruturados, permitindo a extração de informações relevantes para a tomada de decisões.', ans: 'CERTO' },
        { q: 41, s: 'INFORMATICA', t: 'Cloud Computing', txt: 'No modelo IaaS (Infrastructure as a Service), o provedor oferece infraestrutura de hardware virtualizada, cabendo ao cliente gerenciar o sistema operacional e as aplicações.', ans: 'CERTO' },
        { q: 42, s: 'INFORMATICA', t: 'Segurança', txt: 'Ransomware é um tipo de malware que criptografa os arquivos da vítima e exige pagamento para fornecer a chave de descriptografia.', ans: 'CERTO' },
        // Física (43-47)
        { q: 43, s: 'FISICA', t: 'Cinemática', txt: 'A velocidade inicial do veículo era de 30 m/s.', ans: 'CERTO' },
        { q: 44, s: 'FISICA', t: 'Cinemática', txt: 'A desaceleração do veículo foi de 3 m/s².', ans: 'CERTO' },
        { q: 45, s: 'FISICA', t: 'Energia', txt: 'A energia cinética inicial do veículo era de 675.000 J.', ans: 'CERTO' },
        { q: 46, s: 'FISICA', t: 'Dinâmica', txt: 'A força de atrito que atuou sobre o veículo durante a frenagem foi de 4.500 N.', ans: 'CERTO' },
        { q: 47, s: 'FISICA', t: 'Cinemática', txt: 'O tempo necessário para o veículo parar completamente foi de 10 segundos.', ans: 'CERTO' },
        // Ética (48-52)
        { q: 48, s: 'ETICA', t: 'Ética no Serviço Público', txt: 'O servidor público deve agir com lealdade e boa-fé, abstendo-se de condutas que possam prejudicar a imagem da instituição.', ans: 'CERTO' },
        { q: 49, s: 'ETICA', t: 'Código de Ética', txt: 'De acordo com o Código de Ética, deixar de utilizar avanços técnicos e científicos ao seu alcance para atendimento do público constitui conduta vedada ao servidor.', ans: 'CERTO' },
        { q: 50, s: 'ETICA', t: 'Proibições', txt: 'O servidor público pode exercer atividade privada que seja incompatível com o exercício do cargo, desde que autorizado pela chefia imediata.', ans: 'ERRADO' },
        { q: 51, s: 'ETICA', t: 'Ética', txt: 'A função pública deve ser exercida como verdadeiro múnus público, ou seja, como um encargo em favor da coletividade.', ans: 'CERTO' },
        { q: 52, s: 'ETICA', t: 'Comissão de Ética', txt: 'A comissão de ética não possui competência para aplicar penalidades ao servidor, limitando-se a orientá-lo sobre condutas adequadas.', ans: 'ERRADO' },
        // Geopolítica (53-55)
        { q: 53, s: 'NOCOES_CIDADANIA', t: 'Transportes', txt: 'O Brasil possui a maior malha rodoviária pavimentada da América do Sul, sendo o modal rodoviário responsável pela maior parte do transporte de cargas no país.', ans: 'CERTO' },
        { q: 54, s: 'NOCOES_CIDADANIA', t: 'Transportes', txt: 'A dependência do modal rodoviário no Brasil decorre, em parte, dos investimentos realizados a partir da década de 1950, com a instalação da indústria automobilística.', ans: 'CERTO' },
        { q: 55, s: 'NOCOES_CIDADANIA', t: 'Transportes', txt: 'As rodovias federais brasileiras conectam todos os municípios do país, garantindo a integração total do território nacional.', ans: 'ERRADO' },
        // Trânsito (56-85)
        { q: 56, s: 'LEGISLACAO_TRANSITO', t: 'Velocidade', txt: 'A velocidade máxima permitida para veículos de carga em rodovias de pista simples, na ausência de sinalização, é de 80 km/h.', ans: 'CERTO' },
        { q: 57, s: 'LEGISLACAO_TRANSITO', t: 'Habilitação', txt: 'O condutor que tiver a carteira de habilitação apreendida deverá submeter-se a novo exame de habilitação para reavê-la.', ans: 'ERRADO' },
        { q: 58, s: 'LEGISLACAO_TRANSITO', t: 'Perícia', txt: 'A autoridade de trânsito pode determinar a realização de perícia em veículo envolvido em acidente sempre que necessário para a elucidação dos fatos.', ans: 'CERTO' },
        { q: 59, s: 'LEGISLACAO_TRANSITO', t: 'Infrações', txt: 'O transporte de carga em excesso configura infração de trânsito, podendo resultar na retenção do veículo para regularização.', ans: 'CERTO' },
        { q: 60, s: 'LEGISLACAO_TRANSITO', t: 'Equipamentos', txt: 'É dispensável o uso do capacete para condutores de motocicleta quando o veículo estiver em via urbana com velocidade máxima de 40 km/h.', ans: 'ERRADO' },
        { q: 61, s: 'LEGISLACAO_TRANSITO', t: 'Sinalização', txt: 'A sinalização de advertência com triângulo é obrigatória em caso de parada do veículo na pista de rolamento por motivo de emergência.', ans: 'CERTO' },
        { q: 62, s: 'LEGISLACAO_TRANSITO', t: 'CRLV-e', txt: 'O CRLV-e (Certificado de Registro e Licenciamento de Veículo eletrônico) substitui o documento impresso e pode ser apresentado em dispositivo móvel.', ans: 'CERTO' },
        { q: 63, s: 'LEGISLACAO_TRANSITO', t: 'Fiscalização', txt: 'Os equipamentos medidores de velocidade estáticos dispensam sinalização prévia indicativa de fiscalização.', ans: 'ERRADO' },
        { q: 64, s: 'LEGISLACAO_TRANSITO', t: 'Luzes', txt: 'A utilização do farol baixo durante o dia é obrigatória apenas em rodovias de pista simples.', ans: 'ERRADO' },
        { q: 65, s: 'LEGISLACAO_TRANSITO', t: 'Veículos', txt: 'A placa traseira do veículo deve ser iluminada e legível à distância mínima de 20 metros durante a noite.', ans: 'CERTO' },
        { q: 66, s: 'LEGISLACAO_TRANSITO', t: 'Luzes', txt: 'A luz intermitente de emergência (pisca-alerta) pode ser utilizada como advertência em caso de imobilização do veículo ou reboque.', ans: 'CERTO' },
        { q: 67, s: 'LEGISLACAO_TRANSITO', t: 'Infrações', txt: 'Infração gravíssima resulta em sete pontos na carteira de habilitação do condutor.', ans: 'CERTO' },
        { q: 68, s: 'LEGISLACAO_TRANSITO', t: 'SNT', txt: 'O Sistema Nacional de Trânsito tem por finalidade o exercício das atividades de planejamento, administração, normatização, pesquisa, registro e licenciamento de veículos, formação, habilitação e reciclagem de condutores, educação, engenharia, operação do sistema viário, policiamento, fiscalização, julgamento de infrações e de recursos e aplicação de penalidades.', ans: 'CERTO' },
        { q: 69, s: 'LEGISLACAO_TRANSITO', t: 'Transporte Crianças', txt: 'O transporte de crianças com idade inferior a dez anos deve ser realizado obrigatoriamente no banco traseiro do veículo.', ans: 'CERTO' },
        { q: 70, s: 'LEGISLACAO_TRANSITO', t: 'Regras de Circulação', txt: 'A conversão à direita deve ser feita pela faixa da esquerda, quando houver mais de uma faixa no mesmo sentido.', ans: 'ERRADO' },
        { q: 71, s: 'LEGISLACAO_TRANSITO', t: 'Tacógrafo', txt: 'O tacógrafo é obrigatório em veículos de transporte coletivo de passageiros com mais de dez lugares.', ans: 'CERTO' },
        { q: 72, s: 'LEGISLACAO_TRANSITO', t: 'Tacógrafo', txt: 'O equipamento deve registrar a velocidade, a distância percorrida e o tempo de operação do veículo.', ans: 'CERTO' },
        { q: 73, s: 'LEGISLACAO_TRANSITO', t: 'Tacógrafo', txt: 'A aferição do tacógrafo deve ser realizada anualmente ou sempre que houver intervenção no equipamento.', ans: 'CERTO' },
        { q: 74, s: 'LEGISLACAO_TRANSITO', t: 'Pesos e Dimensões', txt: 'O peso bruto total combinado (PBTC) corresponde ao peso máximo transmitido ao pavimento pela combinação de um veículo trator com seu semirreboque.', ans: 'CERTO' },
        { q: 75, s: 'LEGISLACAO_TRANSITO', t: 'Pesos e Dimensões', txt: 'A altura máxima permitida para veículos, incluída a carga, é de 4,40 metros.', ans: 'CERTO' },
        { q: 76, s: 'LEGISLACAO_TRANSITO', t: 'Pesos e Dimensões', txt: 'O excesso de peso por eixo é calculado sobre o limite regulamentar, aplicando-se tolerância de 5%.', ans: 'ERRADO' },
        { q: 77, s: 'LEGISLACAO_TRANSITO', t: 'Motorista Profissional', txt: 'O motorista profissional de transporte de carga deve fazer intervalo mínimo de 30 minutos para descanso a cada 6 horas de direção.', ans: 'ERRADO' },
        { q: 78, s: 'LEGISLACAO_TRANSITO', t: 'Motorista Profissional', txt: 'O descanso semanal do motorista profissional de transporte de carga deve ser de, no mínimo, 35 horas.', ans: 'CERTO' },
        { q: 79, s: 'LEGISLACAO_TRANSITO', t: 'Fiscalização', txt: 'A fiscalização do tempo de direção pode ser feita por meio do registro do tacógrafo ou de anotação em diário de bordo.', ans: 'CERTO' },
        { q: 80, s: 'LEGISLACAO_TRANSITO', t: 'Balança', txt: 'O veículo autuado por excesso de peso deve permanecer retido até a regularização da carga excedente por meio de transbordo.', ans: 'CERTO' },
        { q: 81, s: 'LEGISLACAO_TRANSITO', t: 'Balança', txt: 'A tolerância para o peso bruto total do veículo é de 5% sobre o limite regulamentar.', ans: 'CERTO' },
        { q: 82, s: 'LEGISLACAO_TRANSITO', t: 'Educação', txt: 'A Semana Nacional de Trânsito é realizada anualmente no mês de setembro, com ações educativas em todo o país.', ans: 'CERTO' },
        { q: 83, s: 'LEGISLACAO_TRANSITO', t: 'Cargas', txt: 'A carga que ultrapassar a projeção horizontal do veículo deve estar sinalizada com bandeirola vermelha ou dispositivo refletivo.', ans: 'CERTO' },
        { q: 84, s: 'LEGISLACAO_TRANSITO', t: 'Cargas', txt: 'É permitido o transporte de produtos perigosos em veículos que transportem simultaneamente passageiros.', ans: 'ERRADO' },
        { q: 85, s: 'LEGISLACAO_TRANSITO', t: 'Produtos Perigosos', txt: 'Os veículos que transportam produtos perigosos devem portar kit de emergência compatível com o tipo de carga.', ans: 'CERTO' },
        // BLOCO III
        { q: 86, s: 'DIREITO_ADMINISTRATIVO', t: 'Poder de Polícia', txt: 'A conduta do policial caracteriza exercício regular do poder de polícia administrativa.', ans: 'CERTO' },
        { q: 87, s: 'DIREITO_ADMINISTRATIVO', t: 'Atos Administrativos', txt: 'O atributo da coercibilidade permite que a administração pública imponha suas determinações independentemente da concordância do particular.', ans: 'CERTO' },
        { q: 88, s: 'DIREITO_ADMINISTRATIVO', t: 'Poder de Polícia', txt: 'A recusa do passageiro em apresentar documento justifica sua condução coercitiva à delegacia.', ans: 'CERTO' },
        { q: 89, s: 'DIREITO_ADMINISTRATIVO', t: 'Direitos', txt: 'O direito de ir e vir é absoluto, não admitindo restrições por parte das autoridades públicas.', ans: 'ERRADO' },
        { q: 90, s: 'DIREITO_ADMINISTRATIVO', t: 'Atribuições PRF', txt: 'A fiscalização de documentos de passageiros em transporte coletivo está entre as atribuições da PRF.', ans: 'CERTO' },
        { q: 91, s: 'DIREITO_ADMINISTRATIVO', t: 'Carreira', txt: 'A carreira de policial rodoviário federal é estruturada em classes, sendo a progressão funcional condicionada ao cumprimento de requisitos legais.', ans: 'CERTO' },
        { q: 92, s: 'DIREITO_CONSTITUCIONAL', t: 'Segurança Pública', txt: 'A PRF, órgão permanente do sistema de segurança pública, tem como atribuição constitucional o patrulhamento ostensivo das rodovias federais.', ans: 'CERTO' },
        { q: 93, s: 'DIREITO_CONSTITUCIONAL', t: 'Direitos Sociais', txt: 'É livre o exercício de qualquer trabalho, ofício ou profissão, podendo a lei estabelecer qualificações profissionais.', ans: 'CERTO' },
        { q: 94, s: 'DIREITO_CONSTITUCIONAL', t: 'Prisão', txt: 'A prisão ilegal será imediatamente relaxada pela autoridade judiciária.', ans: 'CERTO' },
        { q: 95, s: 'DIREITO_CONSTITUCIONAL', t: 'Extradição', txt: 'O brasileiro naturalizado pode ser extraditado por crime comum praticado antes da naturalização.', ans: 'CERTO' },
        { q: 96, s: 'DIREITO_CONSTITUCIONAL', t: 'Remédios', txt: 'O habeas corpus é gratuito, assim como os atos necessários ao exercício da cidadania.', ans: 'CERTO' },
        { q: 97, s: 'DIREITO_CONSTITUCIONAL', t: 'Sigilo', txt: 'É inviolável o sigilo de correspondência, sendo admitida sua quebra apenas mediante autorização judicial.', ans: 'ERRADO' },
        { q: 98, s: 'DIREITO_CONSTITUCIONAL', t: 'Estado de Sítio', txt: 'O estado de sítio pode ser decretado pelo Presidente da República após autorização do Congresso Nacional.', ans: 'CERTO' },
        { q: 99, s: 'DIREITO_CONSTITUCIONAL', t: 'Estado de Defesa', txt: 'Durante a vigência do estado de defesa, é possível a restrição do direito de reunião, ainda que exercido no seio das associações.', ans: 'CERTO' },
        { q: 100, s: 'DIREITO_PENAL', t: 'Tráfico', txt: 'A conduta do motorista configura tráfico internacional de drogas, crime de competência da Justiça Federal.', ans: 'CERTO' },
        { q: 101, s: 'DIREITO_PENAL', t: 'Tráfico', txt: 'O crime de tráfico de drogas é inafiançável e insuscetível de graça ou anistia.', ans: 'CERTO' },
        { q: 102, s: 'DIREITO_PENAL', t: 'Processo Penal', txt: 'A prisão em flagrante do condutor caracteriza flagrante próprio.', ans: 'CERTO' },
        { q: 103, s: 'DIREITO_PENAL', t: 'Armas', txt: 'O porte das armas de fogo configura crime autônomo, em concurso com o tráfico de drogas.', ans: 'CERTO' },
        { q: 104, s: 'DIREITO_PENAL', t: 'Perdimento', txt: 'O veículo utilizado no transporte da droga será obrigatoriamente perdido em favor da União, independentemente de ser o condutor seu proprietário.', ans: 'ERRADO' },
        { q: 105, s: 'DIREITO_PENAL', t: 'Descaminho', txt: 'A conduta do motorista configura crime de descaminho.', ans: 'CERTO' },
        { q: 106, s: 'DIREITO_PENAL', t: 'Descaminho', txt: 'O crime de descaminho consuma-se com a simples entrada da mercadoria no território nacional sem o pagamento dos tributos devidos.', ans: 'CERTO' },
        { q: 107, s: 'DIREITO_PENAL', t: 'Competência', txt: 'A competência para processar e julgar o crime de descaminho é da Justiça Estadual.', ans: 'ERRADO' },
        { q: 108, s: 'DIREITO_PENAL', t: 'Procedimento', txt: 'Os produtos apreendidos deverão ser encaminhados à Receita Federal para os procedimentos de perdimento.', ans: 'CERTO' },
        { q: 109, s: 'DIREITO_PENAL', t: 'Busca Veicular', txt: 'A busca no veículo em via pública independe de mandado judicial.', ans: 'CERTO' },
        { q: 110, s: 'DIREITO_PENAL', t: 'Armas', txt: 'O tráfico internacional de arma de fogo é crime equiparado a hediondo.', ans: 'CERTO' },
        { q: 111, s: 'DIREITO_PENAL', t: 'Tortura', txt: 'A prática de tortura por agente público constitui causa de aumento de pena prevista em lei.', ans: 'CERTO' },
        { q: 112, s: 'DIREITO_PENAL', t: 'Abuso de Autoridade', txt: 'A Lei de Abuso de Autoridade prevê que a conduta típica deve ser praticada com a finalidade específica de prejudicar outrem ou beneficiar a si mesmo.', ans: 'CERTO' },
        { q: 113, s: 'DIREITO_PENAL', t: 'Identificação', txt: 'A identificação criminal pode ser realizada quando o indivíduo estiver indiciado ou acusado pela prática de crime que envolva organização criminosa.', ans: 'CERTO' },
        { q: 114, s: 'DIREITO_PENAL', t: 'Hediondos', txt: 'O latrocínio consumado é classificado como crime hediondo.', ans: 'CERTO' },
        { q: 115, s: 'DIREITO_PENAL', t: 'Drogas', txt: 'A Lei de Drogas prevê que o usuário de substância entorpecente está sujeito à pena de detenção.', ans: 'ERRADO' },
        // Direitos Humanos (116-120)
        { q: 116, s: 'DIREITO_CONSTITUCIONAL', t: 'Direitos Humanos', txt: 'Os tratados internacionais de direitos humanos, quando aprovados pelo procedimento das emendas constitucionais, têm status de norma constitucional.', ans: 'CERTO' },
        { q: 117, s: 'DIREITO_CONSTITUCIONAL', t: 'Direitos Humanos', txt: 'A Convenção Americana de Direitos Humanos proíbe a prisão por dívidas, ressalvada a do depositário infiel.', ans: 'ERRADO' },
        { q: 118, s: 'DIREITO_CONSTITUCIONAL', t: 'Direitos Humanos', txt: 'Segundo o STF, os tratados internacionais de direitos humanos não aprovados pelo rito especial possuem hierarquia supralegal.', ans: 'CERTO' },
        { q: 119, s: 'DIREITO_CONSTITUCIONAL', t: 'Direitos Humanos', txt: 'A Declaração Universal dos Direitos Humanos foi adotada pela Assembleia Geral das Nações Unidas em 1948.', ans: 'CERTO' },
        { q: 120, s: 'DIREITO_CONSTITUCIONAL', t: 'Direitos Humanos', txt: 'O direito à vida, previsto na Convenção Americana de Direitos Humanos, é absoluto e não admite nenhuma forma de relativização.', ans: 'ERRADO' },
    ]

    // Create 3 Exams with these questions
    const exams = [
        { title: 'Simulado Nacional PRF - 1º Edição', desc: 'Simulado completo com 120 questões no estilo Cebraspe.', year: 2024 },
        { title: 'Simulado PRF - 2º Edição (Temático)', desc: 'Focado em Legislação de Trânsito e Física Aplicada.', year: 2024 },
        { title: 'Simulado PRF 2025 - Edição 3 (Narcotráfico)', desc: 'Foco em combate ao Narcotráfico e Fronteiras.', year: 2025 },
    ]

    for (const examInfo of exams) {
        // Create Exam
        const createdExam = await prisma.exam.create({
            data: {
                title: examInfo.title,
                description: examInfo.desc,
                totalQuestions: 120, // Now truly 120
                duration: 270,
                year: examInfo.year,
                isActive: true
            }
        })
        console.log(`📝 Exam created: ${examInfo.title}`)

        // Create Questions for this Exam
        // Note: Ideally we reuse questions if they have IDs, but for seeding 
        // without ID conflicts in a loop, we can create fresh instances OR connect if we saved them.
        // For standard "Seed", it's safer to create them joined to the exam to avoid "connect" issues 
        // if IDs aren't persistent. However, creating 360 rows is fine.

        for (const q of questionsData) {
            await prisma.question.create({
                data: {
                    subject: q.s as any,
                    topic: q.t,
                    statement: q.txt,
                    correctAnswer: q.ans,
                    difficulty: 'MEDIUM',
                    institution: 'Cebraspe',
                    year: 2025,
                    options: { "C": "CERTO", "E": "ERRADO" },
                    exams: {
                        connect: { id: createdExam.id }
                    }
                }
            })
        }
    }

    console.log('✅ Seed finished successfully with 3 FULL Exams.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
