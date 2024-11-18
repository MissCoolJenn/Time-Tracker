import threading
import time

# Функция, которую будет выполнять каждый поток
def print_numbers(thread_name, delay):
    for i in range(5):
        time.sleep(delay)
        print(f"{thread_name}: {i}")

# Создаем потоки
thread1 = threading.Thread(target=print_numbers, args=("Поток 1", 1.25))
thread2 = threading.Thread(target=print_numbers, args=("** Поток 2", 0.5))

# Запускаем потоки
thread1.start()
thread2.start()

# Ожидаем завершения потоков
thread1.join()
thread2.join()

print("Все потоки завершены!")