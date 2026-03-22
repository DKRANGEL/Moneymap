import {test, expect} from '@playwright/test'

test.describe('Middleware de autenticação', () => {
    test('redireciona para /login quando não autenticado tenta acessar /dashboard', async ({page}) => {
        await page.goto('/dashboard')
        await expect(page).toHaveURL('/login')
    })

    test('redireciona para /login quando não autenticado tenta acessar /transactions', async ({page}) => {
        await page.goto('/transactions')
        await expect(page).toHaveURL('/login')
    })

    test('página de login carrega corretamente', async ({page}) => {
        await page.goto('/login')
        await expect(page).toHaveURL('/login')
        await expect(page.getByText('Bem-vindo!')).toBeVisible()
        await expect(page.getByText('Entrar com Google')).toBeVisible()
    })
})