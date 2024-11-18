import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget
from PyQt6.QtWebEngineWidgets import QWebEngineView
from jinja2 import Environment, FileSystemLoader

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Настройка окна
        self.setWindowTitle("Jinja2 with PyQt6")
        self.setGeometry(100, 100, 800, 600)

        # Создание виджета и компоновки
        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        self.layout = QVBoxLayout(self.central_widget)

        # Создание QWebEngineView для отображения HTML
        self.browser = QWebEngineView()
        self.layout.addWidget(self.browser)

        # Рендеринг HTML-шаблона
        self.render_template()

    def render_template(self):
        # Создание окружения Jinja2
        env = Environment(loader=FileSystemLoader('.'))
        template = env.get_template('app.html')

        # Рендеринг шаблона
        output = template.render()

        # Отображение HTML в QWebEngineView
        self.browser.setHtml(output)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
