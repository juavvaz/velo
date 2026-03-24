import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';

//AAA - Arrange, Act, Assert

test.describe('Consultar Pedido', () => {

  test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/');
      await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
      
      await page.getByRole('link', { name: 'Consultar Pedido' }).click();
      await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  });

    test('deve consultar um pedido aprovado', async ({ page }) => {
      //Test Data
      const order = 'VLO-0HBWAW';

      //Act
      await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
      await page.getByRole('button', { name: 'Buscar Pedido' }).click();

      //Assert
      const containerPedido = page.getByRole('paragraph')
        .filter({ hasText: /^Pedido$/ })
        .locator('..')

      await expect(containerPedido).toContainText(order,{timeout: 10000});

      await expect(page.getByText('APROVADO')).toBeVisible({ timeout: 5000 });
    });

    test('deve exibir mensagem quando o pedido não for encontrado', async ({ page }) => {
      //Test Data
      const order = generateOrderCode();

      //Act
      await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
      await page.getByRole('button', { name: 'Buscar Pedido' }).click();

      //Assert
      //await expect(page.getByRole('heading', { name: 'Pedido não encontrado', level: 3 })).toBeVisible({ timeout: 5000 });
      //await expect(page.getByText('Verifique o número do pedido e tente novamente')).toBeVisible({ timeout: 5000 });

      await expect(page.locator('#root')).toMatchAriaSnapshot(`
        - img
        - heading "Pedido não encontrado" [level=3]
        - paragraph: Verifique o número do pedido e tente novamente
        `);
    });

    test('deve consultar um pedido aprovado - snapshot', async ({ page }) => {
      //Test Data
      const order = 'VLO-0HBWAW';

      //Act
      await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
      await page.getByRole('button', { name: 'Buscar Pedido' }).click();

      //Assert
      await expect(page.getByTestId(`order-result-${order}`)).toMatchAriaSnapshot(`
        - img
        - paragraph: Pedido
        - paragraph: ${order}
        - img
        - text: APROVADO
        - img "Velô Sprint"
        - paragraph: Modelo
        - paragraph: Velô Sprint
        - paragraph: Cor
        - paragraph: Glacier Blue
        - paragraph: Interior
        - paragraph: cream
        - paragraph: Rodas
        - paragraph: aero Wheels
        - heading "Dados do Cliente" [level=4]
        - paragraph: Nome
        - paragraph: Maria Vieira
        - paragraph: Email
        - paragraph: ju@velo.dev
        - paragraph: Loja de Retirada
        - paragraph
        - paragraph: Data do Pedido
        - paragraph: /\\d+\\/\\d+\\/\\d+/
        - heading "Pagamento" [level=4]
        - paragraph: À Vista
        - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);
    });
});
