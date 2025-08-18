import tkinter as tk
from PIL import Image, ImageTk, ImageSequence

# === CONFIGURAÇÃO DA JANELA ===
janela = tk.Tk()
janela.title("Animação do Baú Lendário")
janela.geometry("600x400")
janela.configure(bg="white")

# === CARREGAR GIF DO BAÚ LENDÁRIO ===
bau_gif = Image.open("bau_lendario.gif")
bau_frames = [frame.copy().convert("RGBA") for frame in ImageSequence.Iterator(bau_gif)]
bau_duration = bau_gif.info.get("duration", 100)

frame_index = 0
imagens = []

# === LABEL PARA EXIBIR O BAÚ ===
bau_label = tk.Label(janela, bg="white")
bau_label.pack(expand=True)

# === FUNÇÃO PARA ATUALIZAR O FRAME ===
def atualizar_bau():
    global frame_index
    frame = bau_frames[frame_index % len(bau_frames)]
    frame_tk = ImageTk.PhotoImage(frame)
    imagens.append(frame_tk)  # Evita o garbage collector
    bau_label.config(image=frame_tk)
    bau_label.image = frame_tk

    frame_index += 1
    if frame_index < len(bau_frames):
        janela.after(bau_duration, atualizar_bau)

# === INICIAR ANIMAÇÃO ===
atualizar_bau()

janela.mainloop()