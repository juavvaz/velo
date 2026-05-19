import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';
import { stat } from 'fs';

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
      const statusBadge = page.getByRole('status').filter({ hasText: 'APROVADO'});
      const statusIcon = statusBadge.locator('svg');

      //Act
      await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
      await page.getByRole('button', { name: 'Buscar Pedido' }).click();

      //Assert
      const containerPedido = page.getByRole('paragraph')
        .filter({ hasText: /^Pedido$/ })
        .locator('..')

      await expect(containerPedido).toContainText(order,{timeout: 10000});
      await expect(page.getByText('APROVADO')).toBeVisible({ timeout: 5000 });

      await expect(statusBadge).toHaveClass(/bg-green-100/);
      await expect(statusBadge).toHaveClass(/text-green-700/);
      await expect(statusIcon).toHaveClass(/lucide-circle-check-big/);
      
    });

    test('deve consultar um pedido reprovado', async ({ page }) => {
      //Test Data
      const order = 'VLO-72R3SM';
      const statusBadge = page.getByRole('status').filter({ hasText: 'REPROVADO'});
      const statusIcon = statusBadge.locator('svg');

      //Act
      await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
      await page.getByRole('button', { name: 'Buscar Pedido' }).click();

      //Assert
      const containerPedido = page.getByRole('paragraph')
        .filter({ hasText: /^Pedido$/ })
        .locator('..')

      await expect(containerPedido).toContainText(order,{timeout: 10000});
      await expect(page.getByText('REPROVADO')).toBeVisible({ timeout: 5000 });

      await expect(statusBadge).toHaveClass(/bg-red-100/);
      await expect(statusBadge).toHaveClass(/text-red-700/);
      await expect(statusIcon).toHaveClass(/lucide-circle-x/);
    });

    test('deve consultar um pedido em analise', async ({ page }) => {
      //Test Data
      const order = 'VLO-LD7PVT';
      const statusBadge = page.getByRole('status').filter({ hasText: 'EM ANALISE'});
      const statusIcon = statusBadge.locator('svg');

      //Act
      await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
      await page.getByRole('button', { name: 'Buscar Pedido' }).click();

      //Assert
      const containerPedido = page.getByRole('paragraph')
        .filter({ hasText: /^Pedido$/ })
        .locator('..')

      await expect(containerPedido).toContainText(order,{timeout: 10000});
      await expect(page.getByText('EM ANALISE')).toBeVisible({ timeout: 5000 });
      
      await expect(statusBadge).toHaveClass(/bg-yellow-100/);
      await expect(statusBadge).toHaveClass(/text-yellow-700/);
      await expect(statusIcon).toHaveClass(/lucide-circle-alert/);
    });

    test('deve consultar um pedido aprovado - snapshot', async ({ page }) => {
      //Test Data
      const order = {
        number: 'VLO-0HBWAW',
        status: 'APROVADO',
        color: 'Glacier Blue',
        interiorColor: 'cream',
        wheels: 'aero Wheels',
        customer: {
          name: 'Maria Vieira',
          email: 'ju@velo.dev',
        },
        payment: 'À Vista'
      };

      //Act
      await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
      await page.getByRole('button', { name: 'Buscar Pedido' }).click();

      //Assert
      await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
        - img
        - paragraph: Pedido
        - paragraph: ${order.number}
        - status:
          - img
          - text: ${order.status}
        - img "Velô Sprint"
        - paragraph: Modelo
        - paragraph: Velô Sprint
        - paragraph: Cor
        - paragraph: ${order.color}
        - paragraph: Interior
        - paragraph: ${order.interiorColor}
        - paragraph: Rodas
        - paragraph: ${order.wheels}
        - heading "Dados do Cliente" [level=4]
        - paragraph: Nome
        - paragraph: ${order.customer.name}
        - paragraph: Email
        - paragraph: ${order.customer.email}
        - paragraph: Loja de Retirada
        - paragraph
        - paragraph: Data do Pedido
        - paragraph: /\\d+\\/\\d+\\/\\d+/
        - heading "Pagamento" [level=4]
        - paragraph: ${order.payment}
        - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);
    });

    test('deve consultar um pedido reprovado - snapshot', async ({ page }) => {
      //Test Data
      const order = {
        number: 'VLO-72R3SM',
        status: 'REPROVADO',
        color: 'Glacier Blue',
        interiorColor: 'cream',
        wheels: 'sport Wheels',
        customer: {
          name: 'Pedro Pascal',
          email: 'pedro.pascal@email.com',
        },
        payment: 'À Vista'
      };

      //Act
      await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
      await page.getByRole('button', { name: 'Buscar Pedido' }).click();

      //Assert
      await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
        - img
        - paragraph: Pedido
        - paragraph: ${order.number}
        - status:
          - img
          - text: ${order.status}
        - img "Velô Sprint"
        - paragraph: Modelo
        - paragraph: Velô Sprint
        - paragraph: Cor
        - paragraph: ${order.color}
        - paragraph: Interior
        - paragraph: ${order.interiorColor}
        - paragraph: Rodas
        - paragraph: ${order.wheels}
        - heading "Dados do Cliente" [level=4]
        - paragraph: Nome
        - paragraph: ${order.customer.name}
        - paragraph: Email
        - paragraph: ${order.customer.email}
        - paragraph: Loja de Retirada
        - paragraph
        - paragraph: Data do Pedido
        - paragraph: /\\d+\\/\\d+\\/\\d+/
        - heading "Pagamento" [level=4]
        - paragraph: ${order.payment}
        - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);
    });

    test('deve consultar um pedido em analise - snapshot', async ({ page }) => {
      //Test Data
      const order = {
        number: 'VLO-LD7PVT',
        status: 'EM ANALISE',
        color: 'Glacier Blue',
        interiorColor: 'cream',
        wheels: 'aero Wheels',
        customer: {
          name: 'Mariana Braga',
          email: 'mariana@email.com',
        },
        payment: 'À Vista'
      };

      //Act
      await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
      await page.getByRole('button', { name: 'Buscar Pedido' }).click();

      //Assert
      await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
        - img
        - paragraph: Pedido
        - paragraph: ${order.number}
        - status:
          - img
          - text: ${order.status}
        - img "Velô Sprint"
        - paragraph: Modelo
        - paragraph: Velô Sprint
        - paragraph: Cor
        - paragraph: ${order.color}
        - paragraph: Interior
        - paragraph: ${order.interiorColor}
        - paragraph: Rodas
        - paragraph: ${order.wheels}
        - heading "Dados do Cliente" [level=4]
        - paragraph: Nome
        - paragraph: ${order.customer.name}
        - paragraph: Email
        - paragraph: ${order.customer.email}
        - paragraph: Loja de Retirada
        - paragraph
        - paragraph: Data do Pedido
        - paragraph: /\\d+\\/\\d+\\/\\d+/
        - heading "Pagamento" [level=4]
        - paragraph: ${order.payment}
        - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);
    });

    test('deve exibir mensagem quando o pedido não for encontrado - snapshot', async ({ page }) => {
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

});
