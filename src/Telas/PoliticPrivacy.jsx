import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Appbar, Title, Paragraph } from 'react-native-paper';

const PrivacyPolitic = ({ navigation }) => {
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Política de Privacidade" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={styles.title}>Bem-vindo à nossa Política de Privacidade!</Title>

        <Paragraph style={styles.paragraph}>
          Esta política descreve como coletamos, usamos e protegemos as suas informações pessoais ao utilizar o nosso aplicativo de lista de compras.
        </Paragraph>

        <Title style={styles.subtitle}>1. Informações que Coletamos</Title>
        <Paragraph style={styles.paragraph}>
          - <Text style={styles.bold}>Informações fornecidas por você:</Text> Quando você cria uma conta, nós coletamos seu nome, e-mail, e outras informações de cadastro.
        </Paragraph>
        <Paragraph style={styles.paragraph}>
          - <Text style={styles.bold}>Dados de uso:</Text> Nós coletamos informações sobre como você utiliza o aplicativo, como listas criadas e itens adicionados.
        </Paragraph>

        <Title style={styles.subtitle}>2. Como Usamos Suas Informações</Title>
        <Paragraph style={styles.paragraph}>
          - <Text style={styles.bold}>Para fornecer e melhorar nossos serviços:</Text> Usamos suas informações para personalizar a experiência, fornecer suporte e melhorar a funcionalidade do aplicativo.
        </Paragraph>
        <Paragraph style={styles.paragraph}>
          - <Text style={styles.bold}>Para comunicação:</Text> Podemos enviar e-mails para informá-lo sobre atualizações ou problemas com sua conta.
        </Paragraph>

        <Title style={styles.subtitle}>3. Compartilhamento de Informações</Title>
        <Paragraph style={styles.paragraph}>
          - Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto conforme necessário para fornecer nossos serviços ou conforme exigido por lei.
        </Paragraph>
        <Paragraph style={styles.paragraph}>
          - Podemos compartilhar informações com o Firebase, que é utilizado para armazenar e gerenciar seus dados.
        </Paragraph>

        <Title style={styles.subtitle}>4. Segurança dos Dados</Title>
        <Paragraph style={styles.paragraph}>
          - Utilizamos medidas de segurança padrão da indústria para proteger suas informações pessoais. No entanto, nenhuma transmissão de dados pela internet é 100% segura, e não podemos garantir a segurança absoluta.
        </Paragraph>

        <Title style={styles.subtitle}>5. Seus Direitos</Title>
        <Paragraph style={styles.paragraph}>
          - Você tem o direito de acessar, corrigir ou excluir suas informações pessoais armazenadas por nós. Entre em contato conosco para exercer esses direitos.
        </Paragraph>

        <Title style={styles.subtitle}>6. Alterações na Política de Privacidade</Title>
        <Paragraph style={styles.paragraph}>
          - Podemos atualizar esta política de privacidade periodicamente. Recomendamos que você revise esta política regularmente para se manter informado sobre como estamos protegendo suas informações.
        </Paragraph>

        <Title style={styles.subtitle}>7. Contato</Title>
        <Paragraph style={styles.paragraph}>
          - Se você tiver dúvidas sobre esta política de privacidade, entre em contato conosco através do e-mail [seuemail@dominio.com].
        </Paragraph>

        <Paragraph style={styles.paragraph}>
          Última atualização: [ 4 / 9 / 2024 ]
        </Paragraph>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40, // Adicionando padding inferior para evitar corte de texto
    backgroundColor:'#333'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 15,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default PrivacyPolitic;
