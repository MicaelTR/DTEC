import tkinter as tk
from PIL import Image, ImageTk, ImageSequence, ImageFilter
import math
import time

# --- Configurações do Jogo ---
VIDA_INICIAL_PERSONAGEM = 100
ORC_MAX_VIDA = 300
GORILA_MAX_VIDA = 500

JANELA_LARGURA, JANELA_ALTURA = 1000, 600

BOTAO_ANDAR_POS = (700, 20)
BOTAO_ANDAR_TRAS_POS = (700, 80)
BOTAO_ATAQUE_POS = (700, 140)
BOTAO_DEFESA_POS = (700, 200)
BOTAO_HITKILL_POS = (700, 260)
BOTAO_DIMENSOES = (180, 50)

FRAME_SIZE_NORMAL = (128, 132)
FRAME_SIZE_DEFESA = (250, 132)
FRAME_SIZE_ATAQUE = (210, 132)

FRAME_SIZE_ORC_PARADO = (FRAME_SIZE_NORMAL[0] * 3, FRAME_SIZE_NORMAL[1] * 3)
FRAME_SIZE_ORC_ATK = (FRAME_SIZE_ORC_PARADO[0] + 400, FRAME_SIZE_ORC_PARADO[1] + 200) # Correção aqui!

FRAME_SIZE_GORILA = (FRAME_SIZE_NORMAL[0] * 3, FRAME_SIZE_NORMAL[1] * 3)
FRAME_SIZE_GORILA_ATK = (FRAME_SIZE_GORILA[0] + 200, FRAME_SIZE_GORILA[1] + 100)

DISTANCIA_ATAQUE_INIMIGO = 200
DELAY_ATAQUE_ORC = 3.0
DELAY_ATAQUE_GORILA = 5

PERSONAGEM_VIDA_POS = (20, 20)
INIMIGO_VIDA_POS_X = JANELA_LARGURA - 190
INIMIGO_VIDA_POS_Y_BASE = 20
BARRA_VIDA_ALTURA = 30

X_PLAY, Y_PLAY = 350, 330

POS_E_X = (JANELA_LARGURA - 150) // 2
POS_E_Y = (JANELA_ALTURA - 150) // 2 + 100

POS_PERSONAGEM_POR_FASE = {
    "fase1": [400, 450],
    "fase2": [600, 320],
    "fase3": [300, 330],
    "fase4": [640, 500],
    "porta": [450, 400],
    "usina": [400, 450], # Posição inicial do personagem na tela da usina
}

POS_INIMIGO_POR_TELA = {
    "fase1": {"parado": (600, 180), "ataque": (400, 200), "frames_parado_path": "orc.gif", "frames_ataque_path": "orcatk.gif", "max_vida": ORC_MAX_VIDA, "delay_ataque": DELAY_ATAQUE_ORC, "tamanho_parado": FRAME_SIZE_ORC_PARADO, "tamanho_ataque": FRAME_SIZE_ORC_ATK},
    "fase2": {"parado": (600, 180), "ataque": (400, 200), "frames_parado_path": "orc.gif", "frames_ataque_path": "orcatk.gif", "max_vida": ORC_MAX_VIDA, "delay_ataque": DELAY_ATAQUE_ORC, "tamanho_parado": FRAME_SIZE_ORC_PARADO, "tamanho_ataque": FRAME_SIZE_ORC_ATK},
    "fase3": {"parado": (600, 180), "ataque": (400, 200), "frames_parado_path": "orc.gif", "frames_ataque_path": "orcatk.gif", "max_vida": ORC_MAX_VIDA, "delay_ataque": DELAY_ATAQUE_ORC, "tamanho_parado": FRAME_SIZE_ORC_PARADO, "tamanho_ataque": FRAME_SIZE_ORC_ATK},
    "fase4": {"parado": (600, 180), "ataque": (400, 200), "frames_parado_path": "orc.gif", "frames_ataque_path": "orcatk.gif", "max_vida": ORC_MAX_VIDA, "delay_ataque": DELAY_ATAQUE_ORC, "tamanho_parado": FRAME_SIZE_ORC_PARADO, "tamanho_ataque": FRAME_SIZE_ORC_ATK},
    "usina": {"parado": (500, 170), "ataque": (400, 80), "frames_parado_path": "gorila.gif", "frames_ataque_path": "gorila_atk.gif", "max_vida": GORILA_MAX_VIDA, "delay_ataque": DELAY_ATAQUE_GORILA, "tamanho_parado": FRAME_SIZE_GORILA, "tamanho_ataque": FRAME_SIZE_GORILA_ATK},
}

BOTOES_FASES_MAPA = {
    "1": (400, 130, 70, 70),
    "2": (600, 320, 70, 70),
    "3": (300, 330, 70, 70),
    "4": (640, 500, 70, 60),
}

# --- Variáveis Globais ---
vida = VIDA_INICIAL_PERSONAGEM
vida_orc = 0
vida_gorila = 0
modo = {
    "parado": True,
    "andar": False,
    "andar_tras": False,
    "atacar": False,
    "defender": False,
    "morto": False,
}
inimigo_animacao_atacando = False
tempo_proximo_ataque_inimigo = 0
frame_index_personagem = 0
frame_index_inimigo_parado = 0
frame_index_inimigo_atk = 0
pilha_telas = []
imagem_fundo_base_da_fase = None
pos_personagem_atual = None
black_screen_alpha = 0
black_screen_fade_direction = 0
black_screen_callback = None
avancar_fase_disponivel = False
current_animation_id = None # Novo: Para armazenar o ID da animação do after

# --- Carregamento de Imagens de Vida ---
imagens_vida = {}
try:
    imagens_vida[100] = Image.open("c5.png").resize((150, BARRA_VIDA_ALTURA)).convert("RGBA")
    imagens_vida[80] = Image.open("c4.png").resize((150, BARRA_VIDA_ALTURA)).convert("RGBA")
    imagens_vida[60] = Image.open("c3.png").resize((150, BARRA_VIDA_ALTURA)).convert("RGBA")
    imagens_vida[40] = Image.open("c2.png").resize((150, BARRA_VIDA_ALTURA)).convert("RGBA")
    imagens_vida[20] = Image.open("c1.png").resize((150, BARRA_VIDA_ALTURA)).convert("RGBA")
    imagens_vida[0] = Image.new("RGBA", (150, BARRA_VIDA_ALTURA), (0, 0, 0, 0))
except FileNotFoundError as e:
    print(f"Erro ao carregar imagem de vida: {e}. Certifique-se de que as imagens 'c1.png' a 'c5.png' estão na mesma pasta.")
    placeholder_vida = Image.new("RGBA", (150, BARRA_VIDA_ALTURA), (255, 0, 0, 128))
    imagens_vida = {k: placeholder_vida for k in [100, 80, 60, 40, 20, 0]}

# --- Carregamento de Fundos de Fases ---
fundos_fases = {}
fase_names = ["fase1", "fase2", "fase3", "fase4", "usina"]
for fase_name in fase_names:
    try:
        fundos_fases[fase_name] = Image.open(f"{fase_name}.png").resize((JANELA_LARGURA, JANELA_ALTURA)).convert("RGBA")
    except FileNotFoundError as e:
        print(f"Erro ao carregar fundo da fase '{fase_name}.png': {e}. Usando fundo padrão.")
        fundos_fases[fase_name] = Image.new("RGBA", (JANELA_LARGURA, JANELA_ALTURA), (0, 0, 0, 255))

# --- Imagens de Telas Especiais ---
try:
    fundo_base = Image.open("inicio.png").resize((JANELA_LARGURA, JANELA_ALTURA)).convert("RGBA")
except FileNotFoundError:
    print("Erro: Arquivo 'inicio.png' não encontrado. Usando fundo preto padrão.")
    fundo_base = Image.new("RGBA", (JANELA_LARGURA, JANELA_ALTURA), (0, 0, 0, 255))

try:
    botao_play = Image.open("btao_play.png").resize((300, 150)).convert("RGBA")
except FileNotFoundError:
    print("Erro: Arquivo 'btao_play.png' não encontrado. Criando botão play placeholder.")
    botao_play = Image.new("RGBA", (300, 150), (0, 255, 0, 128))

try:
    mapa_base = Image.open("mapas.png").resize((JANELA_LARGURA, JANELA_ALTURA)).convert("RGBA")
except FileNotFoundError:
    print("Erro: Arquivo 'mapas.png' não encontrado. Usando fundo preto padrão.")
    mapa_base = Image.new("RGBA", (JANELA_LARGURA, JANELA_ALTURA), (0, 0, 0, 255))

try:
    porta_img = Image.open("porta.png").resize((JANELA_LARGURA, JANELA_ALTURA)).convert("RGBA")
except FileNotFoundError:
    print("Erro: Arquivo 'porta.png' não encontrado. Usando fundo preto padrão.")
    porta_img = Image.new("RGBA", (JANELA_LARGURA, JANELA_ALTURA), (0, 0, 0, 255))

try:
    e_img = Image.open("e.png").resize((150, 150)).convert("RGBA")
except FileNotFoundError:
    print("Erro: Arquivo 'e.png' não encontrado. Criando 'E' placeholder.")
    e_img = Image.new("RGBA", (150, 150), (255, 255, 0, 128))

try:
    morte_img = Image.open("morte.png").resize((400, 200)).convert("RGBA")
except FileNotFoundError:
    print("Erro: Arquivo 'morte.png' não encontrado. Criando morte placeholder.")
    morte_img = Image.new("RGBA", (400, 200), (128, 0, 0, 128))

try:
    restart_img = Image.open("restart.png").resize((200, 100)).convert("RGBA")
except FileNotFoundError:
    print("Erro: Arquivo 'restart.png' não encontrado. Criando restart placeholder.")
    restart_img = Image.new("RGBA", (200, 100), (0, 128, 0, 128))

# --- Funções de Carregamento de Frames ---
def carregar_frames(gif_path, tamanho):
    try:
        gif = Image.open(gif_path)
        frames = [frame.copy().resize(tamanho).convert("RGBA") for frame in ImageSequence.Iterator(gif)]
        duration = gif.info.get("duration", 100)
        return frames, duration
    except FileNotFoundError:
        print(f"Erro: Arquivo GIF '{gif_path}' não encontrado. A animação será desativada.")
        placeholder = Image.new("RGBA", tamanho, (0, 0, 0, 0))
        return [placeholder], 100
    except Exception as e:
        print(f"Erro inesperado ao carregar GIF '{gif_path}': {e}. A animação será desativada.")
        placeholder = Image.new("RGBA", tamanho, (0, 0, 0, 0))
        return [placeholder], 100

# --- Carregamento de Animações do Personagem ---
parado_frames, parado_duration = carregar_frames("parado.gif", FRAME_SIZE_NORMAL)
andar_frames, andar_duration = carregar_frames("andar.gif", FRAME_SIZE_NORMAL)
tras_frames, tras_duration = carregar_frames("tras.gif", FRAME_SIZE_NORMAL)
ataque_frames, ataque_duration = carregar_frames("ataque.gif", (FRAME_SIZE_ATAQUE[0], FRAME_SIZE_NORMAL[1]))
defesa_frames, defesa_duration = carregar_frames("defesa.gif", FRAME_SIZE_DEFESA)

# --- Carregamento de Animações dos Monstros ---
monstro_frames_cache = {}

def get_monstro_frames(tela_id, tipo_animacao):
    if tela_id not in POS_INIMIGO_POR_TELA:
        return [Image.new("RGBA", (100, 100), (0, 0, 0, 0))], 100
    
    info = POS_INIMIGO_POR_TELA[tela_id]
    
    path_key = f"frames_{tipo_animacao}_path"
    size_key = f"tamanho_{tipo_animacao}"

    if path_key not in info or size_key not in info:
        return [Image.new("RGBA", (100, 100), (0, 0, 0, 0))], 100

    gif_path = info[path_key]
    tamanho = info[size_key]

    cache_key = (gif_path, tamanho)
    if cache_key not in monstro_frames_cache:
        frames, duration = carregar_frames(gif_path, tamanho)
        # --- AQUI É ONDE A DURAÇÃO DO GORILA É AJUSTADA ---
        if tela_id == "usina":
            duration = 1500  # Aumente este valor para diminuir a taxa de quadros (animação mais lenta)
        # --- FIM DA MUDANÇA ---
        monstro_frames_cache[cache_key] = (frames, duration)
    
    return monstro_frames_cache[cache_key]

# --- Funções de Ação do Personagem ---
def iniciar_andar():
    if black_screen_fade_direction != 0 or modo["morto"]:
        return
    modo.update({"andar": True, "andar_tras": False, "atacar": False, "defender": False, "parado": False})

def iniciar_andar_tras():
    if black_screen_fade_direction != 0 or modo["morto"]:
        return
    modo.update({"andar_tras": True, "andar": False, "atacar": False, "defender": False, "parado": False})

def parar_andar():
    modo["andar"] = False
    modo["andar_tras"] = False
    modo["parado"] = True

def iniciar_ataque():
    global frame_index_personagem, vida_orc, vida_gorila
    if black_screen_fade_direction != 0 or modo["morto"]:
        return

    tela_atual = pilha_telas[-1]
    inimigo_info = POS_INIMIGO_POR_TELA.get(tela_atual)

    # Só permite ataque se estiver em uma fase de combate
    if not inimigo_info or not (tela_atual.startswith("fase") or tela_atual == "usina"):
        return

    inimigo_vida_atual = vida_orc if "fase" in tela_atual else vida_gorila

    if not modo["atacar"] and inimigo_vida_atual > 0:
        modo.update({"atacar": True, "andar": False, "andar_tras": False, "defender": False, "parado": False})
        frame_index_personagem = 0

        if pos_personagem_atual is None:
            modo["atacar"] = False
            return

        centro_personagem_x = pos_personagem_atual[0] + FRAME_SIZE_NORMAL[0] / 2
        
        inimigo_frames_ataque, _ = get_monstro_frames(tela_atual, "ataque")
        inimigo_frames_parado, _ = get_monstro_frames(tela_atual, "parado")

        inimigo_frame_largura = 0
        if inimigo_animacao_atacando and inimigo_frames_ataque:
            inimigo_frame_largura = inimigo_frames_ataque[frame_index_inimigo_atk % len(inimigo_frames_ataque)].width
            centro_inimigo_x = inimigo_info["ataque"][0] + inimigo_frame_largura / 2
        elif inimigo_frames_parado:
            inimigo_frame_largura = inimigo_frames_parado[frame_index_inimigo_parado % len(inimigo_frames_parado)].width
            centro_inimigo_x = inimigo_info["parado"][0] + inimigo_frame_largura / 2
        else:
            centro_inimigo_x = JANELA_LARGURA / 2

        distancia_ataque_personagem = abs(centro_personagem_x - centro_inimigo_x)

        if distancia_ataque_personagem <= DISTANCIA_ATAQUE_INIMIGO:
            if "fase" in tela_atual:
                vida_orc = max(0, vida_orc - 20)
            elif tela_atual == "usina":
                vida_gorila = max(0, vida_gorila - 20)

def iniciar_defesa():
    global frame_index_personagem
    if black_screen_fade_direction != 0 or modo["morto"]:
        return
    # Só permite defesa se estiver em uma fase de combate
    tela_atual = pilha_telas[-1]
    if not (tela_atual.startswith("fase") or tela_atual == "usina"):
        return
    if not modo["defender"]:
        modo.update({"defender": True, "andar": False, "andar_tras": False, "atacar": False, "parado": False})
        frame_index_personagem = 0

def hitkill_monstro():
    global vida_orc, vida_gorila
    if black_screen_fade_direction != 0 or modo["morto"]:
        return

    tela_atual = pilha_telas[-1]
    inimigo_info = POS_INIMIGO_POR_TELA.get(tela_atual)

    # Só permite hitkill se estiver em uma fase de combate
    if not inimigo_info or not (tela_atual.startswith("fase") or tela_atual == "usina"):
        return

    if inimigo_info:
        if "fase" in tela_atual:
            vida_orc = 0
        elif tela_atual == "usina":
            vida_gorila = 0
    atualizar_frame()

# --- Funções de Navegação de Tela ---
def atualizar_imagem_mapa():
    global imagem_fundo_base_da_fase, pos_personagem_atual
    imagem_fundo_base_da_fase = mapa_base.copy()
    pos_personagem_atual = None

def fase(tela_id):
    global imagem_fundo_base_da_fase, pos_personagem_atual, vida_orc, vida_gorila, vida, avancar_fase_disponivel
    global tempo_proximo_ataque_inimigo, inimigo_animacao_atacando # Resetar variáveis do inimigo

    fundo_para_carregar = fundos_fases.get(tela_id)
    personagem_pos_key = tela_id if tela_id in POS_PERSONAGEM_POR_FASE else "fase1"

    if fundo_para_carregar:
        imagem_fundo_base_da_fase = fundo_para_carregar.copy()
        pos_personagem_atual = POS_PERSONAGEM_POR_FASE.get(personagem_pos_key, [400, 450]).copy()
        
        if not pilha_telas or pilha_telas[-1] != tela_id:
             pilha_telas.append(tela_id)

        inimigo_info = POS_INIMIGO_POR_TELA.get(tela_id)
        if inimigo_info:
            if tela_id.startswith("fase"):
                vida_orc = inimigo_info["max_vida"]
                vida_gorila = 0
            elif tela_id == "usina":
                vida_gorila = inimigo_info["max_vida"]
                vida_orc = 0
        else: # Nenhuma fase de inimigo, garante que a vida do inimigo é 0
            vida_orc = 0
            vida_gorila = 0
        
        vida = VIDA_INICIAL_PERSONAGEM
        avancar_fase_disponivel = False
        modo.update({"parado": True, "andar": False, "andar_tras": False, "atacar": False, "defender": False, "morto": False})
        
        # Resetar timers e animação do inimigo ao mudar de fase
        tempo_proximo_ataque_inimigo = 0
        inimigo_animacao_atacando = False

        atualizar_frame()
    else:
        print(f"Fundo para a tela '{tela_id}' não encontrado.")

def reiniciar_jogo(event=None):
    global vida, vida_orc, vida_gorila, pilha_telas, modo, black_screen_alpha, black_screen_fade_direction, black_screen_callback, frame_index_personagem, avancar_fase_disponivel, tempo_proximo_ataque_inimigo, inimigo_animacao_atacando
    
    # Cancela qualquer after pendente antes de reiniciar
    global current_animation_id
    if current_animation_id:
        janela.after_cancel(current_animation_id)
        current_animation_id = None

    vida = VIDA_INICIAL_PERSONAGEM
    vida_orc = 0
    vida_gorila = 0
    pilha_telas = ["inicio"]
    modo.update({"parado": True, "andar": False, "andar_tras": False, "atacar": False, "defender": False, "morto": False})
    black_screen_alpha = 0
    black_screen_fade_direction = 0
    black_screen_callback = None
    frame_index_personagem = 0
    avancar_fase_disponivel = False
    tempo_proximo_ataque_inimigo = 0
    inimigo_animacao_atacando = False
    
    global imagem_fundo_base_da_fase
    try:
        imagem_fundo_base_da_fase = Image.open("inicio.png").resize((JANELA_LARGURA, JANELA_ALTURA)).convert("RGBA")
    except FileNotFoundError:
        imagem_fundo_base_da_fase = Image.new("RGBA", (JANELA_LARGURA, JANELA_ALTURA), (0, 0, 0, 255))

    atualizar_frame()

def clicar(event):
    if not pilha_telas:
        return
    tela_atual = pilha_telas[-1]

    if modo["morto"]:
        x_restart = (JANELA_LARGURA - restart_img.width) // 2
        y_restart = (JANELA_ALTURA - restart_img.height) // 2 + 100
        if x_restart <= event.x <= x_restart + restart_img.width and y_restart <= event.y <= y_restart + restart_img.height:
            reiniciar_jogo()
        return

    if black_screen_fade_direction != 0:
        return

    if tela_atual == "inicio":
        if X_PLAY <= event.x <= X_PLAY + 300 and Y_PLAY <= event.y <= Y_PLAY + 150:
            pilha_telas.append("mapa")
            atualizar_imagem_mapa()
            atualizar_frame()
    elif tela_atual == "mapa":
        for num, (x, y, w, h) in BOTOES_FASES_MAPA.items():
            if x <= event.x <= x + w and y <= event.y <= y + h:
                fase(f"fase{num}")
                return
    elif tela_atual == "porta":
        if POS_E_X <= event.x <= POS_E_X + e_img.width and \
           POS_E_Y <= event.y <= POS_E_Y + e_img.height:
            iniciar_transicao_tela_preta(lambda: fase("usina"))
            return
    # Ações para fases de combate (faseX e usina)
    elif tela_atual.startswith("fase") or tela_atual == "usina":
        if (BOTAO_ANDAR_POS[0] <= event.x <= BOTAO_ANDAR_POS[0] + BOTAO_DIMENSOES[0] and
            BOTAO_ANDAR_POS[1] <= event.y <= BOTAO_ANDAR_POS[1] + BOTAO_DIMENSOES[1]):
            iniciar_andar()
        elif (BOTAO_ANDAR_TRAS_POS[0] <= event.x <= BOTAO_ANDAR_TRAS_POS[0] + BOTAO_DIMENSOES[0] and
            BOTAO_ANDAR_TRAS_POS[1] <= event.y <= BOTAO_ANDAR_TRAS_POS[1] + BOTAO_DIMENSOES[1]):
            iniciar_andar_tras()
        elif (BOTAO_ATAQUE_POS[0] <= event.x <= BOTAO_ATAQUE_POS[0] + BOTAO_DIMENSOES[0] and
            BOTAO_ATAQUE_POS[1] <= event.y <= BOTAO_ATAQUE_POS[1] + BOTAO_DIMENSOES[1]):
            iniciar_ataque()
        elif (BOTAO_DEFESA_POS[0] <= event.x <= BOTAO_DEFESA_POS[0] + BOTAO_DIMENSOES[0] and
            BOTAO_DEFESA_POS[1] <= event.y <= BOTAO_DEFESA_POS[1] + BOTAO_DIMENSOES[1]):
            iniciar_defesa()
        elif (BOTAO_HITKILL_POS[0] <= event.x <= BOTAO_HITKILL_POS[0] + BOTAO_DIMENSOES[0] and
              BOTAO_HITKILL_POS[1] <= event.y <= BOTAO_HITKILL_POS[1] + BOTAO_DIMENSOES[1]):
            hitkill_monstro()

def soltar_botao(event):
    tela_atual = pilha_telas[-1] if pilha_telas else None
    # Somente parar andar se estiver em uma fase de combate
    if tela_atual and (tela_atual.startswith("fase") or tela_atual == "usina"):
        parar_andar()

def iniciar_transicao_tela_preta(callback_function):
    global black_screen_alpha, black_screen_fade_direction, black_screen_callback
    global frame_index_personagem, inimigo_animacao_atacando, frame_index_inimigo_parado, frame_index_inimigo_atk
    
    frame_index_personagem = 0
    frame_index_inimigo_parado = 0
    frame_index_inimigo_atk = 0
    inimigo_animacao_atacando = False
    modo.update({"parado": True, "andar": False, "andar_tras": False, "atacar": False, "defender": False})

    black_screen_alpha = 0
    black_screen_fade_direction = 1
    black_screen_callback = callback_function
    atualizar_frame() # Inicia a transição imediatamente

def _fazer_transicao_para_porta():
    global imagem_fundo_base_da_fase, pos_personagem_atual
    if pilha_telas and "porta" not in pilha_telas:
        pilha_telas.append("porta")
    imagem_fundo_base_da_fase = porta_img.copy()
    pos_personagem_atual = POS_PERSONAGEM_POR_FASE.get("porta", [450, 400]).copy()
    atualizar_frame()

def exibir_tela_morte():
    global modo, current_animation_id
    # Se já estamos no modo "morto", não fazemos nada para evitar loops ou re-exibições
    if not modo["morto"]:
        modo["morto"] = True
        modo.update({"parado": False, "andar": False, "andar_tras": False, "atacar": False, "defender": False})
        
        # Cancela o 'after' anterior para parar o loop normal
        if current_animation_id:
            janela.after_cancel(current_animation_id)
            current_animation_id = None
        
        # Inicia o loop para a tela de morte
        _atualizar_tela_morte()


def _atualizar_tela_morte():
    global current_animation_id
    if not modo["morto"]: # Se saiu do modo morte por alguma razão (ex: reiniciar jogo)
        current_animation_id = None
        return

    current_base_image = None
    # Tenta pegar o fundo da tela anterior ou atual para aplicar o desfoque
    if len(pilha_telas) > 1:
        tela_fundo_morte = pilha_telas[-2] # Tenta pegar a tela anterior
    else:
        tela_fundo_morte = pilha_telas[-1] # Se não houver anterior, usa a atual

    if tela_fundo_morte == "inicio":
        current_base_image = fundo_base
    elif tela_fundo_morte.startswith("fase"):
        current_base_image = fundos_fases.get(tela_fundo_morte)
    elif tela_fundo_morte == "mapa":
        current_base_image = mapa_base
    elif tela_fundo_morte == "porta":
        current_base_image = porta_img
    elif tela_fundo_morte == "usina": 
        current_base_image = fundos_fases.get("usina") 
    
    if current_base_image:
        imagem = current_base_image.copy().filter(ImageFilter.GaussianBlur(radius=10))
    else:
        imagem = Image.new("RGBA", (JANELA_LARGURA, JANELA_ALTURA), (0,0,0,0))

    x_morte = (JANELA_LARGURA - morte_img.width) // 2
    y_morte = (JANELA_ALTURA - morte_img.height) // 2 - 50
    imagem.paste(morte_img, (x_morte, y_morte), morte_img)

    x_restart = (JANELA_LARGURA - restart_img.width) // 2
    y_restart = (JANELA_ALTURA - restart_img.height) // 2 + 100
    imagem.paste(restart_img, (x_restart, y_restart), restart_img)

    imagem_tk = ImageTk.PhotoImage(imagem)
    fundo_label.config(image=imagem_tk)
    fundo_label.image = imagem_tk
    
    current_animation_id = janela.after(200, _atualizar_tela_morte) # Chama o loop da tela de morte

def clicar_tecla(event):
    global POS_INIMIGO_POR_TELA 
    
    # Adicionando uma verificação para garantir que estamos em uma fase de combate antes de permitir movimentação do inimigo
    tela_atual = pilha_telas[-1] if pilha_telas else None
    
    # Lógica para a tecla 'e' que você já tinha para a porta
    if event.keysym == 'e' and tela_atual == "porta":
        iniciar_transicao_tela_preta(lambda: fase("usina"))
        return # Sai da função após lidar com a tecla 'e'

    # Se não for a usina, não processa as teclas de movimento do inimigo
    if not (tela_atual == "usina"): 
        return 

    # As teclas Left/Right/Up/Down só devem mover o inimigo na usina
    inimigo_info = POS_INIMIGO_POR_TELA.get(tela_atual) # Obtém info do inimigo para a tela atual
    if not inimigo_info: # Garante que há informações do inimigo
        return

    if event.keysym == 'Left':
        current_x = inimigo_info["parado"][0]
        current_y = inimigo_info["parado"][1]
        # Atualiza a posição de 'parado' e 'ataque' para que a animação continue a partir da nova posição
        new_parado_x = max(0, current_x - 10)
        # Ajusta a posição de ataque com base na nova posição do parado
        offset_ataque_x = inimigo_info["parado"][0] - inimigo_info["ataque"][0] # Calcula o offset original
        new_ataque_x = new_parado_x - offset_ataque_x 
        
        POS_INIMIGO_POR_TELA["usina"] = {**POS_INIMIGO_POR_TELA["usina"], "parado": (new_parado_x, current_y), "ataque": (new_ataque_x, inimigo_info["ataque"][1])}
        atualizar_frame()
    elif event.keysym == 'Right':
        current_x = inimigo_info["parado"][0]
        current_y = inimigo_info["parado"][1]
        # Atualiza a posição de 'parado' e 'ataque'
        new_parado_x = min(JANELA_LARGURA - inimigo_info["tamanho_parado"][0], current_x + 10)
        # Ajusta a posição de ataque com base na nova posição do parado
        offset_ataque_x = inimigo_info["parado"][0] - inimigo_info["ataque"][0]
        new_ataque_x = new_parado_x - offset_ataque_x
        
        POS_INIMIGO_POR_TELA["usina"] = {**POS_INIMIGO_POR_TELA["usina"], "parado": (new_parado_x, current_y), "ataque": (new_ataque_x, inimigo_info["ataque"][1])}
        atualizar_frame()
    elif event.keysym == 'Up':
        current_x = inimigo_info["parado"][0]
        current_y = inimigo_info["parado"][1]
        # Atualiza a posição de 'parado' e 'ataque'
        new_parado_y = max(0, current_y - 10)
        # Ajusta a posição de ataque com base na nova posição do parado
        offset_ataque_y = inimigo_info["parado"][1] - inimigo_info["ataque"][1]
        new_ataque_y = new_parado_y - offset_ataque_y
        
        POS_INIMIGO_POR_TELA["usina"] = {**POS_INIMIGO_POR_TELA["usina"], "parado": (current_x, new_parado_y), "ataque": (inimigo_info["ataque"][0], new_ataque_y)}
        atualizar_frame()
    elif event.keysym == 'Down':
        current_x = inimigo_info["parado"][0]
        current_y = inimigo_info["parado"][1]
        # Atualiza a posição de 'parado' e 'ataque'
        new_parado_y = min(JANELA_ALTURA - inimigo_info["tamanho_parado"][1], current_y + 10)
        # Ajusta a posição de ataque com base na nova posição do parado
        offset_ataque_y = inimigo_info["parado"][1] - inimigo_info["ataque"][1]
        new_ataque_y = new_parado_y - offset_ataque_y
        
        POS_INIMIGO_POR_TELA["usina"] = {**POS_INIMIGO_POR_TELA["usina"], "parado": (current_x, new_parado_y), "ataque": (inimigo_info["ataque"][0], new_ataque_y)}
        atualizar_frame()


# --- Função Principal de Atualização de Frame ---
def atualizar_frame():
    global frame_index_personagem, frame_index_inimigo_parado, frame_index_inimigo_atk, tempo_proximo_ataque_inimigo, inimigo_animacao_atacando, vida, vida_orc, vida_gorila, avancar_fase_disponivel
    global black_screen_alpha, black_screen_fade_direction, black_screen_callback, current_animation_id

    # Se estiver no modo "morto", interrompe a execução normal de atualizar_frame
    if modo["morto"]:
        return

    if not pilha_telas:
        current_animation_id = janela.after(200, atualizar_frame)
        return

    tela_atual = pilha_telas[-1]
    proxima_duracao = 100

    # --- Transição de Tela Preta ---
    if black_screen_fade_direction != 0:
        if black_screen_fade_direction == 1:
            black_screen_alpha = min(255, black_screen_alpha + 25)
            if black_screen_alpha >= 255:
                black_screen_alpha = 255
                black_screen_fade_direction = -1
                if black_screen_callback:
                    black_screen_callback()
        elif black_screen_fade_direction == -1:
            black_screen_alpha = max(0, black_screen_alpha - 25)
            if black_screen_alpha <= 0:
                black_screen_alpha = 0
                black_screen_fade_direction = 0
                black_screen_callback = None
        
        imagem_base_transicao = None
        # Lógica para obter a imagem de fundo da tela anterior ou atual durante a transição
        tela_para_fundo = pilha_telas[-2] if len(pilha_telas) > 1 and black_screen_fade_direction == 1 else tela_atual

        if tela_para_fundo.startswith("fase"):
            imagem_base_transicao = fundos_fases.get(tela_para_fundo)
        elif tela_para_fundo == "mapa":
            imagem_base_transicao = mapa_base
        elif tela_para_fundo == "porta":
            imagem_base_transicao = porta_img
        elif tela_para_fundo == "usina":
            imagem_base_transicao = fundos_fases.get("usina")
        elif tela_para_fundo == "inicio":
            imagem_base_transicao = fundo_base

        if imagem_base_transicao:
            imagem = imagem_base_transicao.copy()
            
            # Condições para desenhar elementos específicos DURANTE a transição
            # Somente desenha o botão play se a tela relevante for "inicio"
            if tela_para_fundo == "inicio":
                imagem.paste(botao_play, (X_PLAY, Y_PLAY), botao_play)
            
            # Somente desenha o personagem se houver uma posição atual
            if pos_personagem_atual:
                frame_personagem = parado_frames[frame_index_personagem % len(parado_frames)]
                imagem.paste(frame_personagem, tuple(pos_personagem_atual), frame_personagem)
            
            # Somente desenha o botão 'E' se a tela relevante for "porta"
            if tela_para_fundo == "porta":
                imagem.paste(e_img, (POS_E_X, POS_E_Y), e_img)
        else:
            imagem = Image.new("RGBA", (JANELA_LARGURA, JANELA_ALTURA), (0,0,0,0))

        # Desenha a barra de vida do personagem durante a transição, se a tela de origem/destino for de combate/porta
        if tela_para_fundo.startswith("fase") or tela_para_fundo == "porta" or tela_para_fundo == "usina":
            vida_personagem_arredondada = (vida // 20) * 20
            vida_personagem_para_imagem = max(0, min(100, vida_personagem_arredondada))
            coracao_personagem = imagens_vida.get(vida_personagem_para_imagem)
            if coracao_personagem:
                imagem.paste(coracao_personagem, PERSONAGEM_VIDA_POS, coracao_personagem)

        black_overlay = Image.new("RGBA", (JANELA_LARGURA, JANELA_ALTURA), (0, 0, 0, black_screen_alpha))
        imagem.paste(black_overlay, (0, 0), black_overlay)

        imagem_tk = ImageTk.PhotoImage(imagem)
        fundo_label.config(image=imagem_tk)
        fundo_label.image = imagem_tk
        current_animation_id = janela.after(200, atualizar_frame)
        return

    # --- Lógica de renderização normal da tela ---
    imagem_base = None
    if tela_atual.startswith("fase"):
        imagem_base = fundos_fases.get(tela_atual)
    elif tela_atual == "mapa":
        imagem_base = mapa_base
    elif tela_atual == "porta":
        imagem_base = porta_img
    elif tela_atual == "usina":
        imagem_base = fundos_fases.get("usina") # Correção: Usar .get para segurança
    elif tela_atual == "inicio":
        imagem_base = fundo_base
    else: # Fallback para caso tela_atual não seja reconhecida
        imagem_base = Image.new("RGBA", (JANELA_LARGURA, JANELA_ALTURA), (0,0,0,0))

    if imagem_base:
        imagem = imagem_base.copy()
    else:
        imagem = Image.new("RGBA", (JANELA_LARGURA, JANELA_ALTURA), (0,0,0,0))

    # --- Desenho do personagem (se houver pos_personagem_atual) ---
    if pos_personagem_atual:
        if modo["atacar"]:
            frame_personagem = ataque_frames[frame_index_personagem % len(ataque_frames)]
            proxima_duracao = ataque_duration
            if frame_index_personagem >= len(ataque_frames) - 1:
                modo["atacar"] = False
                modo["parado"] = True
                frame_index_personagem = 0
        elif modo["defender"]:
            frame_personagem = defesa_frames[frame_index_personagem % len(defesa_frames)]
            proxima_duracao = defesa_duration
            if frame_index_personagem >= len(defesa_frames) - 1:
                modo["defender"] = False
                modo["parado"] = True
                frame_index_personagem = 0
        elif modo["andar"]:
            frame_personagem = andar_frames[frame_index_personagem % len(andar_frames)]
            proxima_duracao = andar_duration
            nova_x = pos_personagem_atual[0] + 5
            if nova_x > JANELA_LARGURA - FRAME_SIZE_NORMAL[0]:
                nova_x = JANELA_LARGURA - FRAME_SIZE_NORMAL[0]
            pos_personagem_atual[0] = nova_x
        elif modo["andar_tras"]:
            frame_personagem = tras_frames[frame_index_personagem % len(tras_frames)]
            proxima_duracao = tras_duration
            nova_x = pos_personagem_atual[0] - 5
            if nova_x < 0:
                nova_x = 0
            pos_personagem_atual[0] = nova_x
        else:
            frame_personagem = parado_frames[frame_index_personagem % len(parado_frames)]
            proxima_duracao = parado_duration

        imagem.paste(frame_personagem, tuple(pos_personagem_atual), frame_personagem)

    inimigo_info = POS_INIMIGO_POR_TELA.get(tela_atual)
    current_inimigo_vida = 0

    # --- Lógica de inimigo (apenas em fases de combate) ---
    if inimigo_info and (tela_atual.startswith("fase") or tela_atual == "usina"): # Verifica se é uma fase de combate
        pos_inimigo_parado = inimigo_info["parado"]
        pos_inimigo_atacando = inimigo_info["ataque"]
        frames_inimigo_parado, _ = get_monstro_frames(tela_atual, "parado")
        frames_inimigo_atacando, duration_inimigo_atk = get_monstro_frames(tela_atual, "ataque")
        inimigo_max_vida_referencia = inimigo_info["max_vida"]
        inimigo_delay_ataque_referencia = inimigo_info["delay_ataque"]

        if "fase" in tela_atual:
            current_inimigo_vida = vida_orc
        elif tela_atual == "usina":
            current_inimigo_vida = vida_gorila

        if pos_personagem_atual:
            centro_personagem_x = pos_personagem_atual[0] + FRAME_SIZE_NORMAL[0] / 2
            
            inimigo_frame_largura = 0
            if inimigo_animacao_atacando and frames_inimigo_atacando:
                inimigo_frame_largura = frames_inimigo_atacando[frame_index_inimigo_atk % len(frames_inimigo_atacando)].width
                centro_inimigo_x = inimigo_info["ataque"][0] + inimigo_frame_largura / 2
            elif frames_inimigo_parado:
                inimigo_frame_largura = frames_inimigo_parado[frame_index_inimigo_parado % len(frames_inimigo_parado)].width
                centro_inimigo_x = inimigo_info["parado"][0] + inimigo_frame_largura / 2
            else:
                centro_inimigo_x = 0
            
            distancia = abs(centro_personagem_x - centro_inimigo_x)
        else:
            distancia = float('inf')


        if current_inimigo_vida > 0:
            avancar_fase_disponivel = False # Garante que só avança se o inimigo estiver morto
            if inimigo_animacao_atacando:
                if frames_inimigo_atacando:
                    inimigo_frame_anim = frames_inimigo_atacando[frame_index_inimigo_atk % len(frames_inimigo_atacando)]
                    imagem.paste(inimigo_frame_anim, tuple(pos_inimigo_atacando), inimigo_frame_anim)
                    proxima_duracao = duration_inimigo_atk

                    if frame_index_inimigo_atk >= len(frames_inimigo_atacando) - 1:
                        inimigo_animacao_atacando = False
                        frame_index_inimigo_atk = 0
                        # **MUDANÇA AQUI:** Verifica a vida do personagem logo após o ataque do inimigo
                        if vida <= 0: # Se o personagem morreu AGORA
                            exibir_tela_morte()
                            return # Interrompe o frame atual para exibir a tela de morte
                    else:
                        frame_index_inimigo_atk += 1
                else: # Fallback se não houver frames de ataque
                    if frames_inimigo_parado:
                        inimigo_frame_anim = frames_inimigo_parado[frame_index_inimigo_parado % len(frames_inimigo_parado)]
                        imagem.paste(inimigo_frame_anim, tuple(pos_inimigo_parado), inimigo_frame_anim)
                        frame_index_inimigo_parado += 1
            
            elif distancia <= DISTANCIA_ATAQUE_INIMIGO:
                tempo_atual = time.time()
                if tempo_atual >= tempo_proximo_ataque_inimigo:
                    inimigo_animacao_atacando = True
                    tempo_proximo_ataque_inimigo = tempo_atual + inimigo_delay_ataque_referencia
                    frame_index_inimigo_atk = 0
                    if not modo["defender"]: # Só toma dano se não estiver defendendo
                        vida = max(0, vida - 20)
                        # **MUDANÇA AQUI:** Verifica a vida do personagem logo após o dano
                        if vida <= 0: # Se o personagem morreu AGORA
                            exibir_tela_morte()
                            return # Interrompe o frame atual para exibir a tela de morte
                else: # Inimigo está no alcance, mas não é hora de atacar ainda
                    if frames_inimigo_parado:
                        inimigo_frame_anim = frames_inimigo_parado[frame_index_inimigo_parado % len(frames_inimigo_parado)]
                        imagem.paste(inimigo_frame_anim, tuple(pos_inimigo_parado), inimigo_frame_anim)
                        tempo_proximo_ataque_inimigo = 0 # Reseta o timer de ataque se o jogador sair do alcance
                        frame_index_inimigo_parado += 1
            else: # Inimigo fora do alcance
                if frames_inimigo_parado:
                    inimigo_frame_anim = frames_inimigo_parado[frame_index_inimigo_parado % len(frames_inimigo_parado)]
                    imagem.paste(inimigo_frame_anim, tuple(pos_inimigo_parado), inimigo_frame_anim)
                    tempo_proximo_ataque_inimigo = 0 # Reseta o timer de ataque se o jogador sair do alcance
                    frame_index_inimigo_parado += 1
        else: # Inimigo morreu (current_inimigo_vida <= 0)
            inimigo_animacao_atacando = False
            tempo_proximo_ataque_inimigo = 0
            avancar_fase_disponivel = True # Permite avançar de fase
            
            # Transição automática para a tela da porta após derrotar o inimigo da Fase 1
            if tela_atual == "fase1" and "porta" not in pilha_telas:
                iniciar_transicao_tela_preta(_fazer_transicao_para_porta)
                return

    # --- Desenho da interface de botões (apenas em fases de combate) ---
    if tela_atual.startswith("fase") or tela_atual == "usina":
        cor_andar_frente = (50, 200, 50, 255)
        cor_andar_tras = (200, 150, 50, 255)
        cor_ataque = (200, 50, 50, 255)
        cor_defesa = (50, 50, 200, 255)
        cor_hitkill = (255, 0, 255, 255)

        img_andar = Image.new("RGBA", BOTAO_DIMENSOES, cor_andar_frente)
        img_andar_tras = Image.new("RGBA", BOTAO_DIMENSOES, cor_andar_tras)
        img_ataque = Image.new("RGBA", BOTAO_DIMENSOES, cor_ataque)
        img_defesa = Image.new("RGBA", BOTAO_DIMENSOES, cor_defesa)
        img_hitkill = Image.new("RGBA", BOTAO_DIMENSOES, cor_hitkill)

        imagem.paste(img_andar, BOTAO_ANDAR_POS, img_andar)
        imagem.paste(img_andar_tras, BOTAO_ANDAR_TRAS_POS, img_andar_tras)
        imagem.paste(img_ataque, BOTAO_ATAQUE_POS, img_ataque)
        imagem.paste(img_defesa, BOTAO_DEFESA_POS, img_defesa)
        imagem.paste(img_hitkill, BOTAO_HITKILL_POS, img_hitkill)

    # --- Desenho da vida do personagem (em fases de combate e na porta) ---
    if tela_atual.startswith("fase") or tela_atual == "porta" or tela_atual == "usina":
        vida_personagem_arredondada = (vida // 20) * 20
        vida_personagem_para_imagem = max(0, min(100, vida_personagem_arredondada))
        coracao_personagem = imagens_vida.get(vida_personagem_para_imagem)
        if coracao_personagem:
            imagem.paste(coracao_personagem, PERSONAGEM_VIDA_POS, coracao_personagem)

    # --- Desenha a barra de vida do inimigo apenas se ele estiver vivo e na fase correta ---
    if inimigo_info and (tela_atual.startswith("fase") or tela_atual == "usina") and current_inimigo_vida > 0:
        barras_completas = current_inimigo_vida // 100
        vida_restante = current_inimigo_vida % 100

        for i in range(barras_completas):
            coracao_inimigo_completo = imagens_vida.get(100)
            y_pos_barra = INIMIGO_VIDA_POS_Y_BASE + (2 - i) * (BARRA_VIDA_ALTURA + 5)
            imagem.paste(coracao_inimigo_completo, (INIMIGO_VIDA_POS_X, y_pos_barra), coracao_inimigo_completo)
        
        if vida_restante > 0 or barras_completas == 0: # Desenha a barra parcial ou a primeira barra se vida < 100
            vida_inimigo_para_imagem = (vida_restante // 20) * 20
            vida_inimigo_para_imagem = max(0, min(100, vida_inimigo_para_imagem))
            coracao_inimigo_parcial = imagens_vida.get(vida_inimigo_para_imagem)
            if coracao_inimigo_parcial:
                y_pos_barra_parcial = INIMIGO_VIDA_POS_Y_BASE + (2 - barras_completas) * (BARRA_VIDA_ALTURA + 5)
                imagem.paste(coracao_inimigo_parcial, (INIMIGO_VIDA_POS_X, y_pos_barra_parcial), coracao_inimigo_parcial)

    # --- Desenho de elementos específicos por tela (fora das fases de combate) ---
    elif tela_atual == "inicio":
        imagem.paste(botao_play, (X_PLAY, Y_PLAY), botao_play)
    elif tela_atual == "mapa":
        for num, (x, y, w, h) in BOTOES_FASES_MAPA.items():
            try:
                img_fase_botao = Image.open(f"{num}.png").resize((w, h)).convert("RGBA")
                imagem.paste(img_fase_botao, (x, y), img_fase_botao)
            except FileNotFoundError:
                pass
    elif tela_atual == "porta":
        imagem.paste(e_img, (POS_E_X, POS_E_Y), e_img)
    
    imagem_tk = ImageTk.PhotoImage(imagem)
    fundo_label.config(image=imagem_tk)
    fundo_label.image = imagem_tk

    canvas.delete("all")
    # Desenha texto dos botões (apenas em fases de combate)
    if tela_atual.startswith("fase") or tela_atual == "usina":
        canvas.create_text(BOTAO_ANDAR_POS[0] + BOTAO_DIMENSOES[0]/2,
                           BOTAO_ANDAR_POS[1] + BOTAO_DIMENSOES[1]/2,
                           text="Andar Frente", fill="white", font=("Arial", 12, "bold"))
        canvas.create_text(BOTAO_ANDAR_TRAS_POS[0] + BOTAO_DIMENSOES[0]/2,
                           BOTAO_ANDAR_TRAS_POS[1] + BOTAO_DIMENSOES[1]/2,
                           text="Andar Trás", fill="white", font=("Arial", 12, "bold"))
        canvas.create_text(BOTAO_ATAQUE_POS[0] + BOTAO_DIMENSOES[0]/2,
                           BOTAO_ATAQUE_POS[1] + BOTAO_DIMENSOES[1]/2,
                           text="Atacar", fill="white", font=("Arial", 12, "bold"))
        canvas.create_text(BOTAO_DEFESA_POS[0] + BOTAO_DIMENSOES[0]/2,
                           BOTAO_DEFESA_POS[1] + BOTAO_DIMENSOES[1]/2,
                           text="Defender", fill="white", font=("Arial", 12, "bold"))
        canvas.create_text(BOTAO_HITKILL_POS[0] + BOTAO_DIMENSOES[0]/2,
                           BOTAO_HITKILL_POS[1] + BOTAO_DIMENSOES[1]/2,
                           text="Morte Instantânea", fill="white", font=("Arial", 12, "bold"))

    frame_index_personagem += 1
    
    current_animation_id = janela.after(proxima_duracao, atualizar_frame) # Armazena o ID do after


janela = tk.Tk()
janela.title("Jogo")
janela.geometry(f"{JANELA_LARGURA}x{JANELA_ALTURA}")
janela.resizable(False, False)

canvas = tk.Canvas(janela, width=JANELA_LARGURA, height=JANELA_ALTURA, highlightthickness=0)
canvas.pack()

fundo_label = tk.Label(canvas)
fundo_label.place(x=0, y=0, relwidth=1, relheight=1)

fundo_label.bind("<Button-1>", clicar)
fundo_label.bind("<ButtonRelease-1>", soltar_botao)
janela.bind("<Key>", clicar_tecla)

pilha_telas.append("inicio")
imagem_fundo_base_da_fase = fundo_base.copy()

atualizar_frame()
janela.mainloop()
