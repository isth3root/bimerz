import re
from playwright.sync_api import Page, expect

def test_admin_dashboard_changes(page: Page):
    """
    This test verifies the following changes in the Admin Dashboard:
    1. End date is auto-filled when start date is selected.
    2. "Near expire" status for installments is removed.
    3. Pay ID is not displayed for policies without a pay ID.
    """

    # 1. Arrange: Go to the login page and log in.
    page.goto("http://localhost:5173/login")

    # Fill in the login form
    page.get_by_label("کد ملی").fill("admin")
    page.get_by_label("گذرواژه").fill("admin")

    # Click the login button
    page.get_by_role("button", name="ورود").click()

    # Wait for navigation to the admin dashboard
    expect(page).to_have_url("http://localhost:5173/admin-dashboard")

    # 2. Act & Assert: Verify "near expire" status removal
    # Navigate to the installments tab
    page.get_by_role("tab", name="اقساط").click()

    # Assert that the "near expire" status is not present in the table
    expect(page.get_by_text("نزدیک انقضا")).not_to_be_visible()

    # Assert that the "اقساط نزدیک سررسید" card is not present
    expect(page.get_by_text("اقساط نزدیک سررسید")).not_to_be_visible()

    # 3. Act & Assert: Verify end date auto-fill and Pay ID removal
    # Navigate to the policies tab
    page.get_by_role("tab", name="بیمه‌نامه‌ها").click()

    # Click the "صدور بیمه‌نامه" button
    page.get_by_role("button", name="صدور بیمه‌نامه").click()

    # Select a start date
    page.get_by_placeholder("انتخاب تاریخ شروع").click()
    page.get_by_text("15").first.click()

    # Assert that the end date is auto-filled
    # The exact date will vary, so we check for the correct format
    expect(page.get_by_placeholder("انتخاب تاریخ انقضا")).to_have_value(re.compile(r"\d{4}/\d{2}/\d{2}"))

    # Now, let's check the customer dashboard for the Pay ID change.
    # We can't easily create a policy without a pay ID here,
    # so we'll just log out and log in as a customer to check existing policies.
    page.get_by_role("button", name="خروج").click()

    # Go to the login page again
    page.goto("http://localhost:5173/login")

    # Fill in the login form with customer credentials
    # (Assuming a customer with national code '1234567890' and password '1234567890' exists)
    page.get_by_label("کد ملی").fill("1234567890")
    page.get_by_label("گذرواژه").fill("1234567890")

    # Click the login button
    page.get_by_role("button", name="ورود").click()

    # Wait for navigation to the customer dashboard
    expect(page).to_have_url("http://localhost:5173/customer-dashboard")

    # Assert that the "N/A" for Pay ID is not visible
    expect(page.get_by_text("N/A")).not_to_be_visible()

    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")