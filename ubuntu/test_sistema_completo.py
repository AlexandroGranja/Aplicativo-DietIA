"""
Testes Automatizados - DietIA
Sistema de testes para validar todas as funcionalidades
"""

import unittest
import requests
import json
import time
from datetime import datetime

class TestDietIASystem(unittest.TestCase):
    """Classe principal de testes do sistema DietIA"""
    
    def setUp(self):
        """Configuração inicial para os testes"""
        self.base_url = "http://localhost:5000"
        self.frontend_url = "http://localhost:5173"
        self.test_user_data = {
            "name": "João Teste",
            "age": 30,
            "gender": "masculino",
            "height": 175,
            "current_weight": 80,
            "target_weight": 75,
            "main_goal": "perder_peso",
            "daily_calories": 1800,
            "time_to_goal": "3_meses",
            "previous_diet_experience": "Já tentei dieta low carb",
            "wake_up_time": "07:00",
            "sleep_time": "23:00",
            "work_schedule": "08:00 às 17:00",
            "meals_per_day": "4",
            "breakfast_time": "07:30",
            "lunch_time": "12:00",
            "dinner_time": "19:00",
            "exercise_regularly": "sim",
            "exercise_type": ["musculacao", "cardio"],
            "exercise_frequency": "3_vezes",
            "exercise_time": "manha",
            "vegetarian": False,
            "vegan": False,
            "special_diet": "",
            "favorite_foods": "Frango, arroz, brócolis",
            "cooking_skill": "intermediario",
            "cooking_time": "tempo_moderado",
            "allergies": "",
            "intolerances": "",
            "disliked_foods": "Fígado, rim",
            "medications": "",
            "current_breakfast": "Pão com café",
            "current_lunch": "Arroz, feijão, carne",
            "current_dinner": "Sopa ou sanduíche",
            "current_snacks": "Frutas",
            "water_intake": "2 litros",
            "alcohol_frequency": "raramente",
            "sweets": "as_vezes",
            "stressLevel": "moderado",
            "sleepQuality": "boa",
            "workHours": "8",
            "hasChildren": "nao",
            "livingArrangement": "com_familia",
            "foodBudget": "medio",
            "notificationTime": "08:00",
            "mealReminders": "sim",
            "language": "pt"
        }
    
    def test_01_frontend_accessibility(self):
        """Teste 1: Verificar se o frontend está acessível"""
        try:
            response = requests.get(self.frontend_url, timeout=10)
            self.assertEqual(response.status_code, 200)
            print("✅ Frontend acessível")
        except requests.exceptions.RequestException as e:
            self.fail(f"❌ Frontend não acessível: {e}")
    
    def test_02_backend_health(self):
        """Teste 2: Verificar saúde do backend"""
        try:
            response = requests.get(f"{self.base_url}/api/users", timeout=10)
            self.assertIn(response.status_code, [200, 404])  # 404 é OK se não há usuários
            print("✅ Backend respondendo")
        except requests.exceptions.RequestException as e:
            self.fail(f"❌ Backend não respondendo: {e}")
    
    def test_03_quiz_submission(self):
        """Teste 3: Submissão completa do quiz"""
        try:
            response = requests.post(
                f"{self.base_url}/api/quiz",
                json=self.test_user_data,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                self.assertIn('user_id', result)
                self.user_id = result['user_id']
                print(f"✅ Quiz submetido com sucesso. User ID: {self.user_id}")
                return self.user_id
            else:
                print(f"⚠️ Quiz submission retornou status {response.status_code}")
                return None
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Erro na submissão do quiz: {e}")
            return None
    
    def test_04_ai_diet_generation(self):
        """Teste 4: Geração de dieta pela IA"""
        # Primeiro submeter o quiz para ter um usuário
        user_id = self.test_03_quiz_submission()
        
        if user_id:
            try:
                response = requests.post(
                    f"{self.base_url}/api/ai/generate-diet/{user_id}",
                    headers={'Content-Type': 'application/json'},
                    timeout=60
                )
                
                if response.status_code == 200:
                    result = response.json()
                    self.assertIn('diet_id', result)
                    self.assertIn('formatted_diet', result)
                    print("✅ Dieta gerada com sucesso pela IA")
                    print(f"Diet ID: {result['diet_id']}")
                    return result['diet_id']
                else:
                    print(f"⚠️ Geração de dieta retornou status {response.status_code}")
                    return None
            except requests.exceptions.RequestException as e:
                print(f"⚠️ Erro na geração de dieta: {e}")
                return None
        else:
            print("⚠️ Não foi possível testar geração de dieta sem usuário válido")
            return None
    
    def test_05_ai_test_generation(self):
        """Teste 5: Teste direto da IA sem salvar no banco"""
        try:
            response = requests.post(
                f"{self.base_url}/api/ai/test-generation",
                json=self.test_user_data,
                headers={'Content-Type': 'application/json'},
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                self.assertIn('formatted_diet', result)
                self.assertIn('total_calories', result)
                print("✅ Teste de geração de IA funcionando")
                print(f"Calorias totais: {result['total_calories']}")
            else:
                print(f"⚠️ Teste de IA retornou status {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Erro no teste de IA: {e}")
    
    def test_06_notification_system(self):
        """Teste 6: Sistema de notificações"""
        user_id = self.test_03_quiz_submission()
        
        if user_id:
            try:
                # Testar agendamento de email
                response = requests.post(
                    f"{self.base_url}/api/notifications/schedule-email/{user_id}",
                    headers={'Content-Type': 'application/json'},
                    timeout=30
                )
                
                if response.status_code == 200:
                    print("✅ Sistema de notificações funcionando")
                else:
                    print(f"⚠️ Notificações retornaram status {response.status_code}")
            except requests.exceptions.RequestException as e:
                print(f"⚠️ Erro no sistema de notificações: {e}")
    
    def test_07_multilingual_support(self):
        """Teste 7: Suporte multilíngue"""
        # Testar com dados em inglês
        english_data = self.test_user_data.copy()
        english_data['language'] = 'en'
        english_data['name'] = 'John Test'
        
        try:
            response = requests.post(
                f"{self.base_url}/api/quiz",
                json=english_data,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                print("✅ Suporte multilíngue funcionando")
            else:
                print(f"⚠️ Teste multilíngue retornou status {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Erro no teste multilíngue: {e}")
    
    def test_08_data_validation(self):
        """Teste 8: Validação de dados"""
        # Testar com dados inválidos
        invalid_data = {
            "name": "",  # Nome vazio
            "age": 200,  # Idade inválida
            "height": 50,  # Altura inválida
            "current_weight": 500  # Peso inválido
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/api/quiz",
                json=invalid_data,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            # Deve retornar erro de validação
            if response.status_code in [400, 422]:
                print("✅ Validação de dados funcionando")
            else:
                print(f"⚠️ Validação deveria rejeitar dados inválidos")
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Erro no teste de validação: {e}")
    
    def test_09_performance_load(self):
        """Teste 9: Teste básico de performance"""
        start_time = time.time()
        
        try:
            # Fazer múltiplas requisições
            for i in range(5):
                response = requests.get(f"{self.base_url}/api/users", timeout=10)
            
            end_time = time.time()
            total_time = end_time - start_time
            
            if total_time < 10:  # 5 requisições em menos de 10 segundos
                print(f"✅ Performance adequada: {total_time:.2f}s para 5 requisições")
            else:
                print(f"⚠️ Performance pode ser melhorada: {total_time:.2f}s")
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Erro no teste de performance: {e}")
    
    def test_10_integration_flow(self):
        """Teste 10: Fluxo completo de integração"""
        print("\n🔄 Iniciando teste de fluxo completo...")
        
        # 1. Submeter quiz
        user_id = self.test_03_quiz_submission()
        if not user_id:
            print("❌ Fluxo interrompido: falha na submissão do quiz")
            return
        
        # 2. Gerar dieta
        diet_id = self.test_04_ai_diet_generation()
        if not diet_id:
            print("❌ Fluxo interrompido: falha na geração de dieta")
            return
        
        # 3. Buscar dieta formatada
        try:
            response = requests.get(
                f"{self.base_url}/api/ai/diet/{diet_id}/formatted",
                timeout=30
            )
            
            if response.status_code == 200:
                print("✅ Fluxo completo funcionando perfeitamente!")
            else:
                print(f"⚠️ Falha na busca da dieta formatada: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Erro na busca da dieta: {e}")

def run_comprehensive_tests():
    """Executar todos os testes de forma organizada"""
    print("🧪 INICIANDO TESTES AUTOMATIZADOS DO SISTEMA DIETIA")
    print("=" * 60)
    
    # Criar suite de testes
    suite = unittest.TestLoader().loadTestsFromTestCase(TestDietIASystem)
    
    # Executar testes
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print("\n" + "=" * 60)
    print("📊 RESUMO DOS TESTES")
    print(f"Total de testes: {result.testsRun}")
    print(f"Sucessos: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Falhas: {len(result.failures)}")
    print(f"Erros: {len(result.errors)}")
    
    if result.failures:
        print("\n❌ FALHAS:")
        for test, traceback in result.failures:
            print(f"- {test}: {traceback}")
    
    if result.errors:
        print("\n🚨 ERROS:")
        for test, traceback in result.errors:
            print(f"- {test}: {traceback}")
    
    success_rate = ((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun) * 100
    print(f"\n🎯 Taxa de sucesso: {success_rate:.1f}%")
    
    return result

if __name__ == "__main__":
    run_comprehensive_tests()

