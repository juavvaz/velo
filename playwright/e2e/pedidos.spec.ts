import { test, expect } from '@playwright/test';

//AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {
  //Arrange
  await page.goto('http://localhost:5173/');

  //Checkpoint 1: A página deve estar online
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();

  //Act
  //Checkpoint 2: A página deve acessar a página de consulta de pedidos
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-0HBWAW');
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  //Assert
  await expect(page.getByText('VLO-0HBWAW')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('APROVADO')).toBeVisible({ timeout: 5000 });
});

